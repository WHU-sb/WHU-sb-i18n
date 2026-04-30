const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '..');
const resultsPath = path.join(__dirname, 'validate_results.json');

if (!fs.existsSync(resultsPath)) {
  console.error("Missing validate_results.json");
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const unusedKeys = new Set(results.unusedKeys);

console.log(`Starting cleanup of ${unusedKeys.size} unused keys...`);

const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json') && f !== 'package.json');

let totalRemoved = 0;

for (const file of files) {
  const filePath = path.join(LOCALES_DIR, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let removedInFile = 0;
    
    for (const key of unusedKeys) {
      if (data.hasOwnProperty(key)) {
        delete data[key];
        removedInFile++;
      }
    }
    
    if (removedInFile > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`Removed ${removedInFile} keys from ${file}`);
      totalRemoved += removedInFile;
    } else {
      console.log(`No keys to remove in ${file}`);
    }
  } catch (e) {
    console.error(`Failed processing ${file}: ${e.message}`);
  }
}

console.log(`Cleanup complete. Total keys removed across all files: ${totalRemoved}`);
