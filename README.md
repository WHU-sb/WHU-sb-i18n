# WHU-sb-i18n

武汉大学课程评价系统的国际化翻译文件项目。

## 目录结构

```
WHU-sb-i18n/
│   en.json               # 英文翻译（JSON格式）
│   zh_Hans.json          # 简体中文翻译（JSON格式）
└── README.md                  # 项目说明
```

## 语言支持

- **英文 (en)**: 英语翻译
- **简体中文 (zh_Hans)**: 简体中文翻译

## 翻译文件格式

翻译文件采用展平的键值对格式，使用点号分隔层级：

```json
{
  "common.search": "搜索",
  "common.submit": "提交",
  "common.cancel": "取消",
  "home.title": "WHU Course Review System",
  "home.subtitle": "发现最好的课程，分享你的学习体验",
  "courses.title": "课程列表",
  "courses.subtitle": "发现适合你的课程",
  "reviews.addReview": "添加评价",
  "reviews.editReview": "编辑评价"
}
```

## 翻译模块

翻译键按功能模块组织：

- `common.*`: 通用翻译（按钮、状态、提示等）
- `navigation.*`: 导航相关翻译
- `home.*`: 首页相关翻译
- `courses.*`: 课程相关翻译
- `reviews.*`: 评价相关翻译
- `teachers.*`: 教师相关翻译
- `search.*`: 搜索相关翻译
- `about.*`: 关于页面翻译
- `error.*`: 错误页面翻译
- `user.*`: 用户相关翻译
- `admin.*`: 管理后台翻译
- `validation.*`: 表单验证翻译
- `time.*`: 时间相关翻译
- `theme.*`: 主题相关翻译
- `pagination.*`: 分页相关翻译

## 使用方法

### 添加新语言

1. 在 `locales/` 目录下创建新的语言文件（如 `ja.json`）
2. 复制现有语言文件作为模板
3. 翻译相应的内容
4. 在 `index.json` 中添加新语言配置

### 添加新翻译键

1. 在所有语言的JSON文件中添加新的翻译键
2. 确保所有语言都有对应的翻译
3. 使用点号分隔的格式：`module.key`

## 开发规范

- 翻译键使用点号分隔的层级结构（如：`common.search`）
- 翻译值使用双引号包围
- 保持翻译键的一致性
- 支持插值语法：`{variableName}`
- 复数形式使用：`{count, plural, one {单数} other {复数}}`

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交翻译更改
4. 创建 Pull Request

## 许可证

MIT License
