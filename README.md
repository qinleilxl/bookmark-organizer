# Bookmark AI Organizer 🤖📚

AI-powered Chrome extension for intelligent bookmark organization.

[English](#english) | [中文](#中文)

---

## English

### Features

- **🤖 AI Smart Categorization** - Automatically analyze and categorize your bookmarks using AI (supports Ollama, OpenAI, Anthropic, etc.)
- **🔄 Deduplication** - Detect and remove duplicate bookmarks
- **📁 Auto-Organize** - Move bookmarks into well-organized category folders
- **💾 Backup & Export** - Export bookmarks to standard HTML format
- **🗑️ Clean Empty Folders** - Find and delete empty bookmark folders
- **🌐 Multi-language** - Supports English and Chinese

### Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

### Project Structure

```
bookmark-organizer/
├── public/                 # Chrome extension files
│   ├── manifest.json      # Extension manifest (v3)
│   └── background.js       # Service worker
├── src/
│   ├── components/         # React components
│   │   ├── ActionButtons.jsx
│   │   ├── CategoryResults.jsx
│   │   ├── Header.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── StatsCard.jsx
│   │   ├── StatusMessage.jsx
│   │   └── StreamingContent.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useApiConfig.js
│   │   └── useBookmarkData.js
│   ├── i18n/             # Internationalization
│   │   ├── translations.js
│   │   └── useLocale.jsx
│   ├── utils/            # Utility functions
│   │   └── bookmarks.js
│   ├── App.jsx           # Main component
│   └── main.jsx          # Entry point
└── scripts/
    └── generate-icons.mjs
```

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

### Development

```bash
# Start dev server
npm run dev

# Lint code
npm run lint
```

---

## 中文

### 功能特性

- **🤖 AI 智能分类** - 使用 AI（支持 Ollama、OpenAI、Anthropic 等）自动分析并分类书签
- **🔄 书签去重** - 检测并删除重复的书签
- **📁 自动整理** - 将书签移动到分类文件夹中
- **💾 备份导出** - 导出书签为标准 HTML 格式
- **🗑️ 清理空文件夹** - 查找并删除空的书签文件夹
- **🌐 多语言** - 支持英文和中文

### 技术栈

- **React 19** - UI 框架
- **Vite 7** - 构建工具
- **Tailwind CSS 4** - 样式
- **Lucide React** - 图标

### 安装

```bash
# 克隆仓库
git clone https://github.com/qinleilxl/bookmark-organizer.git
cd bookmark-organizer

# 安装依赖
npm install

# 构建扩展
npm run build
```

### 加载到 Chrome

1. 打开 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `dist` 文件夹

### 开发

```bash
# 启动开发服务器
npm run dev

# 代码检查
npm run lint
```

---

## License

MIT
