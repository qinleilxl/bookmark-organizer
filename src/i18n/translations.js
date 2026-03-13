export const translations = {
  // Header
  appTitle: {
    zh: "AI 书签整理助手",
    en: "AI Bookmark Organizer",
  },

  // Stats
  totalBookmarks: {
    zh: "总书签数",
    en: "Total Bookmarks",
  },
  folders: {
    zh: "文件夹",
    en: "Folders",
  },

  // Backup warning
  backupWarning: {
    zh: "为防止误操作丢失数据，建议在整理前先备份所有书签。",
    en: "To prevent data loss from accidental operations, it is recommended to back up all bookmarks before organizing.",
  },
  backupNow: {
    zh: "立即备份",
    en: "Backup Now",
  },

  // Action buttons
  analyzing: {
    zh: "正在分析中...",
    en: "Analyzing...",
  },
  organizing: {
    zh: "整理进行中...",
    en: "Organizing...",
  },
  analyzeAndClassify: {
    zh: "分析并分类",
    en: "Analyze & Classify",
  },
  removeDuplicates: {
    zh: "去除重复书签",
    en: "Remove Duplicates",
  },
  findEmptyFolders: {
    zh: "查找空文件夹",
    en: "Find Empty Folders",
  },
  executeOrganize: {
    zh: "执行整理",
    en: "Organize",
  },

  // Loading messages
  analyzingWithAI: {
    zh: "正在使用 AI 分析书签...",
    en: "Analyzing bookmarks with AI...",
  },
  analyzingWithRules: {
    zh: "未配置 API Key，将使用本地规则分类分析书签...",
    en: "No API Key configured, will use local rules to classify bookmarks...",
  },
  detectingDuplicates: {
    zh: "正在检测重复书签...",
    en: "Detecting duplicate bookmarks...",
  },
  organizingBookmarks: {
    zh: "正在整理书签...",
    en: "Organizing bookmarks...",
  },
  findingEmptyFolders: {
    zh: "正在查找空书签文件夹...",
    en: "Searching for empty bookmark folders...",
  },
  analyzingBookmarks: {
    zh: "正在分析书签...",
    en: "Analyzing bookmarks...",
  },

  // Status messages
  analysisComplete: {
    zh: "分析完成！{categoryCount} 个大类，{subCategoryCount} 个子类，共 {total} 个书签",
    en: "Analysis complete! {categoryCount} categories, {subCategoryCount} subcategories, {total} bookmarks in total",
  },
  noDuplicatesFound: {
    zh: "没有发现重复书签",
    en: "No duplicate bookmarks found",
  },
  removedDuplicates: {
    zh: "已删除 {count} 个重复书签",
    en: "Removed {count} duplicate bookmarks",
  },
  organizeComplete: {
    zh: "整理完成！已移动 {count} 个书签到分类文件夹",
    en: "Organization complete! Moved {count} bookmarks to category folders",
  },
  alreadyOrganized: {
    zh: "书签已在分类文件夹中，无需移动",
    en: "Bookmarks are already in category folders, no need to move",
  },
  moveFailed: {
    zh: "移动失败 {count} 个，可能是书签已在目标文件夹或ID无效",
    en: "Failed to move {count} bookmarks, they may already be in the target folder or have invalid IDs",
  },
  backupExported: {
    zh: "书签备份已导出为 {filename}",
    en: "Bookmarks backup exported as {filename}",
  },
  noEmptyFoldersFound: {
    zh: "没有找到空的书签文件夹",
    en: "No empty bookmark folders found",
  },
  foundEmptyFolders: {
    zh: "找到 {count} 个空书签文件夹，可选择删除",
    en: "Found {count} empty bookmark folders, you can choose to delete",
  },
  deletedOneEmptyFolder: {
    zh: "已删除 1 个空文件夹，剩余 {count} 个",
    en: "Deleted 1 empty folder, {count} remaining",
  },
  deletedAllEmptySelected: {
    zh: "已删除所有选中的空文件夹",
    en: "Deleted all selected empty folders",
  },
  noEmptyFoldersToDelete: {
    zh: "当前没有可删除的空文件夹",
    en: "No empty folders to delete",
  },
  confirmDeleteAll: {
    zh: "确定要删除所有 {count} 个空书签文件夹吗？此操作不可撤销。",
    en: "Are you sure you want to delete all {count} empty bookmark folders? This action cannot be undone.",
  },
  deletedAllEmpty: {
    zh: "已删除所有空书签文件夹",
    en: "Deleted all empty bookmark folders",
  },

  // Error messages
  analysisFailed: {
    zh: "分析失败",
    en: "Analysis failed",
  },
  analysisError: {
    zh: "分析失败: {message}",
    en: "Analysis failed: {message}",
  },
  deduplicationFailed: {
    zh: "去重失败",
    en: "Deduplication failed",
  },
  deduplicationError: {
    zh: "去重失败: {message}",
    en: "Deduplication failed: {message}",
  },
  organizeFailed: {
    zh: "整理失败",
    en: "Organization failed",
  },
  organizeError: {
    zh: "整理失败: {message}",
    en: "Organization failed: {message}",
  },
  backupFailed: {
    zh: "备份书签失败",
    en: "Backup failed",
  },
  backupError: {
    zh: "备份书签失败: {message}",
    en: "Backup failed: {message}",
  },
  findEmptyFoldersFailed: {
    zh: "查找空文件夹失败",
    en: "Failed to find empty folders",
  },
  findEmptyFoldersError: {
    zh: "查找空文件夹失败: {message}",
    en: "Failed to find empty folders: {message}",
  },
  deleteEmptyFolderFailed: {
    zh: "删除空文件夹失败",
    en: "Failed to delete empty folder",
  },
  deleteEmptyFolderError: {
    zh: "删除空文件夹失败: {message}",
    en: "Failed to delete empty folder: {message}",
  },
  noCategoriesToOrganize: {
    zh: "没有可整理的分类，请先进行分析",
    en: "No categories to organize, please analyze first",
  },

  // Notifications
  analysisCompleteNotification: {
    zh: "书签分析完成",
    en: "Bookmark analysis complete",
  },
  analysisCompleteNotificationMsg: {
    zh: "{categoryCount} 个大类，{subCategoryCount} 个子类",
    en: "{categoryCount} categories, {subCategoryCount} subcategories",
  },
  organizeCompleteNotification: {
    zh: "书签整理完成",
    en: "Bookmark organization complete",
  },
  organizeCompleteNotificationMsg: {
    zh: "已移动 {count} 个书签到分类文件夹",
    en: "Moved {count} bookmarks to category folders",
  },

  // Empty folders panel
  emptyFoldersTitle: {
    zh: "空书签文件夹",
    en: "Empty Bookmark Folders",
  },
  emptyFoldersTitleCount: {
    zh: "空书签文件夹（{count}）",
    en: "Empty Bookmark Folders ({count})",
  },
  deleteAll: {
    zh: "删除全部",
    en: "Delete All",
  },
  delete: {
    zh: "删除",
    en: "Delete",
  },
  unnamedFolder: {
    zh: "(未命名文件夹)",
    en: "(Unnamed Folder)",
  },

  // Settings
  settings: {
    zh: "API 设置",
    en: "API Settings",
  },
  collapseSettings: {
    zh: "收起设置",
    en: "Collapse Settings",
  },
  expandSettings: {
    zh: "API 设置",
    en: "API Settings",
  },
  apiPreset: {
    zh: "API 预设",
    en: "API Preset",
  },
  apiUrl: {
    zh: "API URL",
    en: "API URL",
  },
  model: {
    zh: "模型",
    en: "Model",
  },
  apiKey: {
    zh: "API Key",
    en: "API Key",
  },
  apiKeyPlaceholder: {
    zh: "sk-xxx 或空(Ollama无需Key)",
    en: "sk-xxx or empty (Ollama doesn't need Key)",
  },
  noApiKeyHint: {
    zh: "不填 API Key 则使用关键词规则分类",
    en: "If no API Key is provided, keyword rules will be used for classification",
  },

  // Streaming
  aiAnalyzing: {
    zh: "AI 正在分析...",
    en: "AI is analyzing...",
  },

  // Language switcher
  language: {
    zh: "语言",
    en: "Language",
  },
};

// Helper to get translation
export function t(key, params = {}, locale = "zh") {
  const text = translations[key]?.[locale] || translations[key]?.zh || key;
  return text.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
}