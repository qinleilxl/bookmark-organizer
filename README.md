# 🗂️ Bookmark AI Organizer

AI-powered browser bookmark organization tool built with React + Tailwind CSS.

## 功能

- 🔍 **智能分析** - 分析书签并自动分类
- 🧹 **去重** - 检测并删除重复书签
- 🤖 **AI 分类** - 支持 OpenAI API 智能分类
- 📁 **整理** - 一键将书签移动到分类文件夹

## 技术栈

- React 19
- Tailwind CSS 4
- Vite
- Lucide React (图标)

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 安装插件

1. 打开 Chrome/Edge 浏览器
2. 访问 `chrome://extensions/`
3. 开启「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择 `dist` 文件夹

## 使用

1. 点击浏览器工具栏的插件图标
2. 查看书签统计
3. 点击「分析并分类」进行分类
4. 点击「执行整理」将书签移动到分类文件夹
5. (可选) 输入 API Key 启用 AI 智能分类

## API Key

支持 OpenAI API，输入 `sk-` 开头的 API Key 即可启用 AI 智能分类。

不输入时使用关键词规则分类。

## 项目结构

```
bookmark-organizer/
├── src/
│   ├── App.jsx        # 主组件
│   ├── main.jsx      # 入口
│   └── index.css    # Tailwind 样式
├── public/
│   └── manifest.json # 插件配置
├── index.html
├── vite.config.js
└── tailwind.config.js
```
