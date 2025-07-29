# WHU-sb-i18n

武汉大学课程评价系统 (WHU.sb) 的国际化翻译文件仓库。

## 📖 简介

本仓库存储 WHU.sb 项目的所有国际化翻译文件，支持多语言本地化。通过集中管理翻译资源，便于维护和协作。

## 🌍 支持的语言

- 🇨🇳 **中文简体** (`zh-CN`) - 默认语言
- 🇺🇸 **英文** (`en-US`) - 英文版本

## 📁 文件结构

```
WHU-sb-i18n/
├── README.md
├── zh-CN/
│   ├── common.json          # 通用翻译
│   ├── navigation.json      # 导航相关
│   ├── home.json           # 首页相关
│   ├── courses.json        # 课程相关
│   ├── reviews.json        # 评价相关
│   ├── teachers.json       # 教师相关
│   ├── search.json         # 搜索相关
│   ├── admin.json          # 管理后台
│   ├── errors.json         # 错误页面
│   ├── validation.json     # 表单验证
│   └── time.json           # 时间相关
├── en-US/
│   ├── common.json
│   ├── navigation.json
│   ├── home.json
│   ├── courses.json
│   ├── reviews.json
│   ├── teachers.json
│   ├── search.json
│   ├── admin.json
│   ├── errors.json
│   ├── validation.json
│   └── time.json
└── templates/
    ├── common.json         # 翻译模板
    ├── navigation.json
    ├── home.json
    ├── courses.json
    ├── reviews.json
    ├── teachers.json
    ├── search.json
    ├── admin.json
    ├── errors.json
    ├── validation.json
    └── time.json
```

## 🔧 使用方法

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/WHU-sb-i18n.git
cd WHU-sb-i18n
```

### 2. 在主项目中引用

在主项目 `WHU.sb` 中，可以通过以下方式引用翻译文件：

```typescript
// 动态导入翻译文件
const loadTranslations = async (locale: string) => {
  const translations = await import(`@/i18n/${locale}/index.json`)
  return translations.default
}
```

### 3. 添加新语言

1. 在根目录创建新的语言文件夹（如 `ja-JP/`）
2. 复制 `templates/` 中的模板文件到新语言文件夹
3. 翻译所有 JSON 文件中的内容
4. 更新主项目的语言配置

## 📝 翻译规范

### 1. 文件命名

- 使用小写字母和连字符
- 按功能模块分类
- 保持文件名简洁明了

### 2. JSON 结构

```json
{
  "common": {
    "search": "搜索",
    "submit": "提交",
    "cancel": "取消"
  },
  "navigation": {
    "home": "首页",
    "courses": "课程"
  }
}
```

### 3. 翻译键命名

- 使用点号分隔的层级结构
- 使用小写字母和下划线
- 保持语义清晰

### 4. 占位符使用

对于包含变量的翻译，使用 `{variableName}` 格式：

```json
{
  "pagination": {
    "showing": "显示第 {start} 到 {end} 条，共 {total} 条"
  }
}
```

## 🤝 贡献指南

### 1. Fork 仓库

1. 点击右上角的 "Fork" 按钮
2. 克隆你的 Fork 到本地

### 2. 创建分支

```bash
git checkout -b feature/add-new-language
```

### 3. 添加翻译

1. 在对应语言文件夹中添加或修改翻译文件
2. 确保 JSON 格式正确
3. 测试翻译的完整性

### 4. 提交更改

```bash
git add .
git commit -m "feat: add Japanese translation"
git push origin feature/add-new-language
```

### 5. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 描述你的更改
3. 等待审核和合并

## 📋 翻译检查清单

在提交翻译之前，请确保：

- [ ] 所有翻译键都已翻译
- [ ] JSON 格式正确
- [ ] 占位符使用正确
- [ ] 没有遗漏的翻译
- [ ] 翻译内容准确且符合语境
- [ ] 已测试翻译的显示效果

## 🔄 同步更新

当主项目添加新的翻译键时：

1. 更新 `templates/` 中的模板文件
2. 通知所有语言维护者
3. 各语言维护者更新对应的翻译文件
4. 确保所有语言版本保持同步

## 📞 相关仓库

- 项目主页：https://github.com/WHU-sb/WHU-sb
- 翻译仓库：https://github.com/WHU-sb/WHU-sb-i18n

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为 WHU.sb 项目提供翻译支持的贡献者！

---

**注意**：本仓库仅用于存储翻译文件，主项目代码请访问 [WHU.sb](https://github.com/your-username/WHU.sb) 仓库。