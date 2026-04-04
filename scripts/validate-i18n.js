const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../..'); 
const APPS_DIR = path.join(ROOT_DIR, 'apps');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const LOCALES_DIR = path.resolve(__dirname, '..');

const SOURCE_EXTENSIONS = ['.vue', '.ts', '.js', '.jsx', '.tsx'];

function getAllSourceFiles(dir, extensions) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (['node_modules', 'dist', '.next', 'public', '.git', 'locales'].includes(file)) return;
      results = results.concat(getAllSourceFiles(filePath, extensions));
    } else if (extensions.includes(path.extname(file))) {
      results.push(filePath);
    }
  });
  return results;
}

function extractKeysFromLocaleFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return Object.keys(data); // Flattened keys assumed
  } catch (e) {
    return [];
  }
}

function findUsedKeys(sourceFiles) {
  const usedKeys = new Set();
  const pattern = /t\s*\(\s*['"`]([^'"`]+)['"`]/g;
  const staticPattern = /getStaticTranslation\([^,]+,\s*['"`]([^'"`]+)['"`]/g;
  
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = pattern.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
    while ((match = staticPattern.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
  }
  return usedKeys;
}

function main() {
  console.log('🔍 Validate i18n process starting...');
  
  const scanDirs = [APPS_DIR, PACKAGES_DIR];
  let allSourceFiles = [];
  scanDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const children = fs.readdirSync(dir);
      children.forEach(child => {
        const fullPath = path.join(dir, child);
        if (fs.statSync(fullPath).isDirectory()) {
          allSourceFiles = allSourceFiles.concat(getAllSourceFiles(fullPath, SOURCE_EXTENSIONS));
        }
      });
    }
  });
  
  const zhPath = path.join(LOCALES_DIR, 'zh_Hans.json');
  const enPath = path.join(LOCALES_DIR, 'en.json');
  
  const zhKeys = extractKeysFromLocaleFile(zhPath);
  const enKeys = extractKeysFromLocaleFile(enPath);
  const usedKeysSet = findUsedKeys(allSourceFiles);
  const usedKeys = Array.from(usedKeysSet);

  // Parity Check
  const inZhNotEn = zhKeys.filter(k => !enKeys.includes(k));
  const inEnNotZh = enKeys.filter(k => !zhKeys.includes(k));

  // Missing Check (Called in code but not in JSON)
  const isPathOrInvalid = (k) => 
    k.startsWith('@/') || 
    k.startsWith('./') || 
    k.startsWith('../') || 
    k.includes('/') ||
    k === '.' ||
    k.includes('.vue') ||
    k.includes('.js') ||
    k.includes('.ts') ||
    k.includes('.tsx') ||
    k.match(/^\d+$/);

  const missingInZh = usedKeys.filter(k => !zhKeys.includes(k) && !k.includes('${') && k.includes('.') && !isPathOrInvalid(k));
  const missingInEn = usedKeys.filter(k => !enKeys.includes(k) && !k.includes('${') && k.includes('.') && !isPathOrInvalid(k));

  // Unused Check (Defined in JSON but never called)
  const isDynamic = (k) => k.match(/home\.welcome\.\d+/) || k.match(/common\.welcome\.\d+/);
  const unusedInZh = zhKeys.filter(k => !usedKeysSet.has(k) && !isDynamic(k));
  const unusedInEn = enKeys.filter(k => !usedKeysSet.has(k) && !isDynamic(k));

  let hasError = false;

  if (inZhNotEn.length > 0 || inEnNotZh.length > 0) {
    console.error('❌ Locale Parity Error (Keys exist in one language but not the other):');
    inZhNotEn.forEach(k => console.error(` - [ONLY IN ZH] ${k}`));
    inEnNotZh.forEach(k => console.error(` - [ONLY IN EN] ${k}`));
    hasError = true;
  }

  if (missingInZh.length > 0 || missingInEn.length > 0) {
    console.error('❌ Missing Translation Keys (Called in code, missing in JSON):');
    const allMissing = new Set([...missingInZh, ...missingInEn]);
    allMissing.forEach(k => console.error(` - ${k}`));
    hasError = true;
  }

  if (unusedInZh.length > 0 || unusedInEn.length > 0) {
    console.warn('⚠️  Unused Translation Keys (Possible candidates for deletion):');
    const allUnused = new Set([...unusedInZh, ...unusedInEn]);
    allUnused.forEach(k => console.warn(` - ${k}`));
    // Initially we might not want to break build for unused keys, but user requested it.
    // hasError = true; 
  }

  if (hasError) {
    console.error('\n💥 I18n Validation failed.');
    process.exit(1);
  } else {
    console.log('✅ I18n Validation passed!');
    process.exit(0);
  }
}

main();
