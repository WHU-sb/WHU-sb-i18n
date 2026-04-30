const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '..');
const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'package.json');

for (const file of files) {
  const filePath = path.join(LOCALES_DIR, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Remove invalid literal keys
    delete data['legal.${docType}.fallback'];
    delete data['legal.${docType}.title'];
    delete data['./global.config'];
    
    // Fix teaching title
    if (data['app.navigation.categories.teaching.title']?.includes('[TODO]')) {
       if (file.includes('en')) data['app.navigation.categories.teaching.title'] = 'Teaching & Research';
       else if (file.includes('zh') || file.includes('yue')) data['app.navigation.categories.teaching.title'] = '教学科研';
       else data['app.navigation.categories.teaching.title'] = 'Teaching & Research';
    }

    // Add explicit legal keys
    const isEn = file.includes('en');
    const isZh = file.includes('zh') || file.includes('yue');
    
    data['legal.privacy.title'] = isZh ? '隐私政策' : (isEn ? 'Privacy Policy' : 'Privacy Policy');
    data['legal.privacy.fallback'] = isZh ? '未能加载隐私政策内容。' : (isEn ? 'Failed to load Privacy Policy content.' : 'Failed to load Privacy Policy content.');
    
    data['legal.terms.title'] = isZh ? '服务条款' : (isEn ? 'Terms of Service' : 'Terms of Service');
    data['legal.terms.fallback'] = isZh ? '未能加载服务条款内容。' : (isEn ? 'Failed to load Terms of Service content.' : 'Failed to load Terms of Service content.');
    
    // Fix last updated
    if (data['legal.last_updated']?.includes('[TODO]')) {
      data['legal.last_updated'] = isZh ? '最后更新：2026年4月' : 'Last updated: April 2026';
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  } catch (e) {
    console.error(`Failed processing ${file}: ${e.message}`);
  }
}
console.log('Fixed TODO keys in all files.');
