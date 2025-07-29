const fs = require('fs');
const path = require('path');

// 创建目录结构
function createDirectories() {
  const dirs = [
    'locales'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 将TypeScript对象转换为JSON
function convertTsToJson(tsContent, language) {
  // 移除TypeScript语法
  let jsonContent = tsContent
    .replace(/const\s+\w+\s*=\s*/, '') // 移除 const xxx = 
    .replace(/export\s+default\s+\w+/, '') // 移除 export default
    .replace(/\/\/.*$/gm, '') // 移除注释
    .trim();
  
  // 移除末尾的分号
  if (jsonContent.endsWith(';')) {
    jsonContent = jsonContent.slice(0, -1);
  }
  
  try {
    // 解析为JSON对象
    const obj = eval(`(${jsonContent})`);
    return obj;
  } catch (error) {
    console.error(`解析 ${language} 文件时出错:`, error);
    return null;
  }
}

// 写入JSON文件
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ 已创建: ${filePath}`);
  } catch (error) {
    console.error(`✗ 写入文件失败 ${filePath}:`, error);
  }
}

// 创建语言索引文件
function createLanguageIndex() {
  const index = {
    languages: {
      en: {
        name: 'English',
        nativeName: 'English',
        code: 'en',
        flag: '🇺🇸'
      },
      'zh-CN': {
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        code: 'zh-CN',
        flag: '🇨🇳'
      }
    },
    defaultLanguage: 'zh-CN',
    fallbackLanguage: 'en'
  };
  
  writeJsonFile('locales/index.json', index);
}

// 主转换函数
function convertLegacyFiles() {
  console.log('开始转换legacy翻译文件...\n');
  
  // 创建目录
  createDirectories();
  
  // 转换英文文件
  const enTsPath = path.join('legacy', 'en_US.ts');
  if (fs.existsSync(enTsPath)) {
    const enTsContent = fs.readFileSync(enTsPath, 'utf8');
    const enTranslations = convertTsToJson(enTsContent, 'en_US');
    
    if (enTranslations) {
      const filePath = path.join('locales', 'en.json');
      writeJsonFile(filePath, enTranslations);
    }
  }
  
  // 转换中文文件
  const zhTsPath = path.join('legacy', 'zh_CN.ts');
  if (fs.existsSync(zhTsPath)) {
    const zhTsContent = fs.readFileSync(zhTsPath, 'utf8');
    const zhTranslations = convertTsToJson(zhTsContent, 'zh_CN');
    
    if (zhTranslations) {
      const filePath = path.join('locales', 'zh-CN.json');
      writeJsonFile(filePath, zhTranslations);
    }
  }
  
  // 创建语言索引
  createLanguageIndex();
  
  console.log('\n转换完成！');
  console.log('生成的文件结构:');
  console.log('locales/');
  console.log('├── en.json');
  console.log('├── zh-CN.json');
  console.log('└── index.json');
}

// 运行转换
if (require.main === module) {
  convertLegacyFiles();
}

module.exports = { convertLegacyFiles }; 