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

// 展平嵌套对象为单层键值对
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 递归展平嵌套对象
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      // 直接赋值
      flattened[newKey] = value;
    }
  }
  
  return flattened;
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
      'zh_Hans': {
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        code: 'zh_Hans',
        flag: '🇨🇳'
      }
    },
    defaultLanguage: 'zh_Hans',
    fallbackLanguage: 'en'
  };
  
  writeJsonFile('index.json', index);
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
      const flattenedEn = flattenObject(enTranslations);
      const filePath = path.join('locales', 'en.json');
      writeJsonFile(filePath, flattenedEn);
    }
  }
  
  // 转换中文文件
  const zhTsPath = path.join('legacy', 'zh_CN.ts');
  if (fs.existsSync(zhTsPath)) {
    const zhTsContent = fs.readFileSync(zhTsPath, 'utf8');
    const zhTranslations = convertTsToJson(zhTsContent, 'zh_CN');
    
    if (zhTranslations) {
      const flattenedZh = flattenObject(zhTranslations);
      const filePath = path.join('locales', 'zh_Hans.json');
      writeJsonFile(filePath, flattenedZh);
    }
  }
  
  // 创建语言索引
  createLanguageIndex();
  
  console.log('\n转换完成！');
  console.log('生成的文件结构:');
  console.log('├── locales/');
  console.log('│   ├── en.json');
  console.log('│   └── zh_Hans.json');
  console.log('└── index.json');
  console.log('\n翻译键格式示例:');
  console.log('- common.search');
  console.log('- home.title');
  console.log('- courses.courseDetail');
  console.log('- reviews.addReview');
}

// 运行转换
if (require.main === module) {
  convertLegacyFiles();
}

module.exports = { convertLegacyFiles }; 