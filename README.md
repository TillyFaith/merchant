# 知识管理与数据可视化系统

一个基于 Vue 3 的企业级知识管理平台，集成智能问答、文档管理和数据可视化功能，支持知识沉淀、检索与数据分析。

## 🌟 特性

- 📊 数据可视化仪表盘（热力图/高频问题分析/零命中统计）
- 📑 知识文档全生命周期管理（上传/编辑/分类/版本控制）
- 💬 AI 智能问答（上下文理解/多轮对话/代码高亮）
- 🔄 文档分类体系（业务场景分类/标签管理）
- 💾 本地数据持久化（离线可用/状态自动恢复）
- 🎨 响应式设计（桌面/平板/移动端适配）
- 💬 多会话管理
- 📝 Markdown 支持
- 🖥️ 代码高亮显示
- 📤 文件和图片上传
- 🌊 流式响应
- 🎨 深色/浅色主题
- 💾 本地数据持久化
- 📱 响应式设计

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Vite
- **状态管理**: Pinia + 持久化插件
- **UI 组件**: Element Plus
- **数据可视化**: ECharts
- **路由管理**: Vue Router
- **样式处理**: SCSS
- **Markdown 渲染**: Marked.js
- **代码高亮**: Highlight.js
- **动画效果**: Animate.css
- **持久化存储**: Pinia-plugin-persistedstate

## 📸 项目演示

## 📦 项目结构

```bash
src/
├── assets/ # 静态资源
├── components/ # 组件
│ ├── KnowledgeHeatmap.vue # 知识点热力图
│ ├── HighFrequencyQuestions.vue # 高频问题组件
│ ├── SideMenu.vue # 分类侧边菜单
│ ├── Top5Documents.vue # 热门文档组件
│ └── ...
├── stores/ # Pinia 状态管理
│ ├── chat.js # 聊天相关状态
│ ├── knowledge.js # 知识文档状态
│ └── dataVisualization.js # 可视化数据状态
├── views/ # 页面
│ ├── KnowledgeManagementView.vue # 文档管理页面
│ ├── DataVisualizationView.vue # 数据可视化页面
│ ├── visualize.vue # 统计仪表盘
│ └── ...
│ ├── ChatInput.vue # 聊天输入框组件
│ ├── ChatMessage.vue # 消息显示组件
│ ├── DialogEdit.vue # 对话编辑弹窗
│ ├── PopupMenu.vue # 侧边菜单组件
│ ├── SearchDialog.vue # 搜索对话框组件
│ └── SettingsPanel.vue # 设置面板组件
├── stores/ # Pinia 状态管理
│ ├── chat.js # 聊天相关状态
│ └── setting.js # 设置相关状态
├── utils/ # 工具函数
│ ├── api.js # API 请求封装
│ ├── markdown.js # Markdown 处理
│ └── messageHandler.js # 消息处理
├── views/ # 页面
│ ├── HomePage.vue # 首页
│ └── ChatView.vue # 主聊天页面
└── App.vue # 根组件
```

## 🚀 功能特点

### 知识文档管理

- 支持 PDF/Word/TXT 多格式文档上传
- 文档分类与标签体系化管理
- 完整的 CRUD 操作与状态控制（生效/失效）

### 数据可视化分析

- 知识点热力图：直观展示知识覆盖度
- 高频问题 Top10：识别用户关注焦点
- 零命中问题追踪：优化知识盲点
- 文档引用统计：评估知识价值

### 多会话管理

- 创建、切换、编辑和删除会话
- 会话标题自动保存
- 确保至少存在一个会话

### 消息功能

- 支持文本消息发送
- 图片和文件上传预览
- 流式响应显示
- Markdown 实时渲染
- 代码块语法高亮
- 代码复制功能

### 用户界面

- 简洁现代的界面风格
- 流畅的动画过渡效果
- 深色/浅色主题切换

## 🔧 配置项

### 模型设置

- 支持多种 LLM 模型
- 可配置 API 密钥
- 自定义模型参数

## 💾 数据持久化

使用 Pinia 持久化插件实现：

- 会话历史记录
- 用户设置
- 主题偏好

## 🔨 开发指南

### 安装依赖

```bash
pnpm install
```

### 运行项目

```bash
pnpm dev
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📄 许可证

[MIT License](LICENSE)
