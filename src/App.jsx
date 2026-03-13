import { useState } from "react";
import { useBookmarkData } from "./hooks/useBookmarkData";
import { useApiConfig } from "./hooks/useApiConfig";
import { useLocale } from "./i18n/useLocale";
import { flattenBookmarks } from "./utils/bookmarks";
import { t } from "./i18n/translations";
import { Header } from "./components/Header";
import { StatsCard } from "./components/StatsCard";
import { ActionButtons } from "./components/ActionButtons";
import { StatusMessage } from "./components/StatusMessage";
import { StreamingContent } from "./components/StreamingContent";
import { CategoryResults } from "./components/CategoryResults";
import { SettingsPanel } from "./components/SettingsPanel";

function showNotification(notificationTitle, message, locale) {
  if (chrome.notifications) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "/icons/icon48.png",
      title: notificationTitle,
      message: message,
      priority: 1,
    });
  }
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [emptyFolders, setEmptyFolders] = useState([]);
  const { locale } = useLocale();

  const {
    stats,
    loading,
    setLoading,
    status,
    setStatus,
    categories,
    setCategories,
    streamingContent,
    setStreamingContent,
    operation,
    setOperation,
    refreshKey,
    forceRefresh,
    loadStats,
  } = useBookmarkData();

  const { apiConfig, setApiConfig, saveApiConfig, handlePresetChange } =
    useApiConfig();

  const analyzeBookmarks = async () => {
    const isUsingOllama =
      apiConfig.url?.includes("localhost") || apiConfig.url?.includes("ollama");
    const willUseAI = Boolean(apiConfig.key || isUsingOllama);
    setCategories({});
    setStreamingContent("");
    setStatus(null);
    setOperation(null);
    await chrome.storage.local.remove([
      "lastAnalysis",
      "operationStatus",
      "streamingContent",
    ]);

    setLoading(true);
    setStatus({
      type: "loading",
      message: willUseAI
        ? t("analyzingWithAI", {}, locale)
        : t("analyzingWithRules", {}, locale),
    });
    setOperation("analyzing");
    await chrome.storage.local.set({ operationStatus: "analyzing" });

    try {
      const tree = await chrome.bookmarks.getTree();
      const bookmarks = flattenBookmarks(tree);

      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          { type: "analyze", apiConfig, bookmarks },
          (resp) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(resp);
            }
          }
        );
      });

      if (response.success) {
        const result = response.result;
        const categoryCount = Object.keys(result).length;
        const subCategoryCount = Object.values(result).reduce(
          (sum, subs) => sum + subs.length,
          0
        );
        const totalBookmarks = Object.values(result).reduce(
          (sum, subs) =>
            sum + subs.reduce((s, sub) => s + sub.bookmarks.length, 0),
          0
        );

        setCategories(result);
        setTimeout(() => forceRefresh(), 100);
        setStreamingContent("");
        setOperation(null);
        await chrome.storage.local.remove(["operationStatus", "streamingContent"]);

        const successMsg = t(
          "analysisComplete",
          { categoryCount, subCategoryCount, total: totalBookmarks },
          locale
        );
        setStatus({ type: "success", message: successMsg });
        showNotification(
          locale === "zh" ? "🎉 书签分析完成" : "🎉 Analysis Complete",
          `${categoryCount} ${locale === "zh" ? "个大类" : "categories"}, ${subCategoryCount} ${locale === "zh" ? "个子类" : "subcategories"}`,
          locale
        );
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      setOperation(null);
      setStatus({
        type: "error",
        message: `${t("analysisFailed", {}, locale)}: ${error.message}`,
      });
      await chrome.storage.local.set({
        operationStatus: null,
        streamingContent: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const deduplicateBookmarks = async () => {
    setLoading(true);
    setStatus({ type: "loading", message: t("detectingDuplicates", {}, locale) });

    try {
      const tree = await chrome.bookmarks.getTree();
      const allBookmarks = flattenBookmarks(tree);
      const urlMap = new Map();
      const duplicates = [];

      allBookmarks.forEach((bookmark) => {
        const url = bookmark.url.toLowerCase();
        if (urlMap.has(url)) {
          duplicates.push(urlMap.get(url));
        } else {
          urlMap.set(url, bookmark);
        }
      });

      if (duplicates.length === 0) {
        setStatus({ type: "success", message: t("noDuplicatesFound", {}, locale) });
      } else {
        for (const dup of duplicates) {
          await chrome.bookmarks.remove(dup.id);
        }
        setStatus({
          type: "success",
          message: t("removedDuplicates", { count: duplicates.length }, locale),
        });
        loadStats();
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `${t("deduplicationFailed", {}, locale)}: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const organizeBookmarks = async () => {
    const TEMP_FOLDER_NAME = (locale === "zh" ? "临时书签_" : "Temp Bookmarks_") + Date.now();
    if (Object.keys(categories).length === 0) {
      setStatus({ type: "error", message: t("noCategoriesToOrganize", {}, locale) });
      return;
    }

    setLoading(true);
    setStatus({ type: "loading", message: t("organizingBookmarks", {}, locale) });
    setOperation("organizing");
    await chrome.storage.local.set({ operationStatus: "organizing" });

    try {
      let movedCount = 0;
      let errorCount = 0;

      const tempFolder = await new Promise((resolve) => {
        chrome.bookmarks.create(
          { parentId: "1", title: TEMP_FOLDER_NAME },
          resolve
        );
      });

      const tree = await new Promise((resolve) => {
        chrome.bookmarks.getTree(resolve);
      });

      const moveAll = async (node) => {
        if (node.url) {
          await new Promise((resolve) => {
            chrome.bookmarks.move(node.id, { parentId: tempFolder.id }, resolve);
          });
        } else if (node.children) {
          for (const child of node.children) {
            await moveAll(child);
          }
          if (
            tempFolder.id !== node.id &&
            node.id !== "0" &&
            node.id !== "1" &&
            node.id !== "2"
          ) {
            await new Promise((resolve) => {
              chrome.bookmarks.removeTree(node.id, resolve);
            });
          }
        }
      };

      await moveAll(tree[0]);

      for (const [category, subList] of Object.entries(categories)) {
        const newCatFolder = await chrome.bookmarks.create({
          title: category,
          parentId: "1",
        });
        const categoryFolderId = newCatFolder.id;

        for (const sub of subList) {
          const subCategory = sub.subCategory;
          const newSubFolder = await chrome.bookmarks.create({
            title: subCategory,
            parentId: categoryFolderId,
          });
          const subFolderId = newSubFolder.id;

          for (const bookmark of sub.bookmarks) {
            try {
              await chrome.bookmarks.move(bookmark.id, {
                parentId: subFolderId,
              });
              movedCount++;
            } catch (e) {
              errorCount++;
            }
          }
        }
      }

      await new Promise((resolve) => {
        chrome.bookmarks.removeTree(tempFolder.id, resolve);
      });

      if (movedCount === 0 && errorCount > 0) {
        setStatus({
          type: "error",
          message: t("moveFailed", { count: errorCount }, locale),
        });
      } else if (movedCount === 0) {
        setStatus({
          type: "warning",
          message: t("alreadyOrganized", {}, locale),
        });
      } else {
        setStatus({
          type: "success",
          message: t("organizeComplete", { count: movedCount }, locale),
        });
        showNotification(
          locale === "zh" ? "🎉 书签整理完成" : "🎉 Organization Complete",
          locale === "zh"
            ? `已移动 ${movedCount} 个书签到分类文件夹`
            : `Moved ${movedCount} bookmarks to category folders`,
          locale
        );
      }

      setCategories({});
      await chrome.storage.local.remove(["lastAnalysis", "operationStatus"]);
      loadStats();
      setOperation(null);
    } catch (error) {
      setStatus({
        type: "error",
        message: `${t("organizeFailed", {}, locale)}: ${error.message}`,
      });
      await chrome.storage.local.set({ operationStatus: null });
      setOperation(null);
    } finally {
      setLoading(false);
    }
  };

  const backupAllBookmarks = async () => {
    try {
      const tree = await chrome.bookmarks.getTree();
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const mi = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const fileName = `bookmarks-${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}.html`;

      const escapeHtml = (str = "") =>
        String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

      let html = '';
      html += '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n';
      html += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n';
      html += '<TITLE>Bookmarks</TITLE>\n';
      html += '<H1>Bookmarks</H1>\n';
      html += '<DL><p>\n';

      const walk = (node, indent = "    ") => {
        if (node.children && node.children.length) {
          const title = escapeHtml(node.title || "Bookmarks");
          const addDate = node.dateAdded ? Math.floor(node.dateAdded / 1000) : "";
          html += `${indent}<DT><H3 ADD_DATE="${addDate}">${title}</H3>\n`;
          html += `${indent}<DL><p>\n`;
          node.children.forEach((child) => walk(child, indent + "    "));
          html += `${indent}</DL><p>\n`;
        } else if (node.url) {
          const title = escapeHtml(node.title || node.url);
          const href = escapeHtml(node.url);
          const addDate = node.dateAdded ? Math.floor(node.dateAdded / 1000) : "";
          html += `${indent}<DT><A HREF="${href}" ADD_DATE="${addDate}">${title}</A>\n`;
        }
      };

      const root = tree[0];
      if (root.children && root.children.length) {
        root.children.forEach((child) => walk(child));
      }

      html += "</DL><p>\n";

      const blob = new Blob([html], {
        type: "text/html",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus({
        type: "success",
        message: t("backupExported", { filename }, locale),
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: `${t("backupFailed", {}, locale)}: ${error.message}`,
      });
    }
  };

  const findEmptyFolders = async () => {
    setLoading(true);
    setStatus({ type: "loading", message: t("findingEmptyFolders", {}, locale) });
    try {
      const tree = await chrome.bookmarks.getTree();
      const folders = [];

      const hasAnyBookmark = (node) => {
        if (node.url) return true;
        if (!node.children || node.children.length === 0) return false;
        return node.children.some(hasAnyBookmark);
      };

      const collectEmptyFolders = (node) => {
        const isSystemRoot = node.id === "0" || node.id === "1" || node.id === "2";

        if (!node.url && (!node.children || node.children.length === 0)) {
          if (!isSystemRoot) {
            folders.push(node);
          }
          return;
        }

        if (node.children && node.children.length > 0) {
          if (!hasAnyBookmark(node)) {
            if (!isSystemRoot) {
              folders.push(node);
            }
            return;
          }
          node.children.forEach(collectEmptyFolders);
        }
      };

      collectEmptyFolders(tree[0]);

      setEmptyFolders(folders);
      if (folders.length === 0) {
        setStatus({ type: "success", message: t("noEmptyFoldersFound", {}, locale) });
      } else {
        setStatus({
          type: "success",
          message: t("foundEmptyFolders", { count: folders.length }, locale),
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `${t("findEmptyFoldersFailed", {}, locale)}: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEmptyFolder = async (folderId) => {
    try {
      await chrome.bookmarks.removeTree(folderId);
      const remaining = emptyFolders.filter((f) => f.id !== folderId);
      setEmptyFolders(remaining);
      setStatus({
        type: "success",
        message:
          remaining.length > 0
            ? t("deletedOneEmptyFolder", { count: remaining.length }, locale)
            : t("deletedAllEmptyFolders", {}, locale),
      });
      loadStats();
    } catch (error) {
      setStatus({
        type: "error",
        message: `${t("deleteEmptyFolderFailed", {}, locale)}: ${error.message}`,
      });
    }
  };

  const deleteAllEmptyFolders = async () => {
    if (!emptyFolders.length) {
      setStatus({ type: "error", message: t("noEmptyFoldersToDelete", {}, locale) });
      return;
    }
    if (
      !window.confirm(
        t("confirmDeleteAll", { count: emptyFolders.length }, locale)
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      for (const folder of emptyFolders) {
        try {
          await chrome.bookmarks.removeTree(folder.id);
        } catch {
          // ignore single folder error and continue
        }
      }
      setEmptyFolders([]);
      setStatus({
        type: "success",
        message: t("deletedAllEmpty", {}, locale),
      });
      loadStats();
    } catch (error) {
      setStatus({
        type: "error",
        message: `${t("deleteEmptyFolderFailed", {}, locale)}: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={refreshKey} className="min-w-[380px] bg-gray-50 p-4">
      <Header />
      <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
        <div className="flex items-center justify-between gap-2">
          <span>{t("backupWarning", {}, locale)}</span>
          <button
            onClick={backupAllBookmarks}
            className="shrink-0 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs"
          >
            {t("backupNow", {}, locale)}
          </button>
        </div>
      </div>
      <StatsCard stats={stats} />
      <ActionButtons
        loading={loading}
        operation={operation}
        hasCategories={Object.keys(categories).length > 0}
        onAnalyze={analyzeBookmarks}
        onDeduplicate={deduplicateBookmarks}
        onOrganize={organizeBookmarks}
        onFindEmptyFolders={findEmptyFolders}
      />
      {emptyFolders.length > 0 && (
        <div className="mb-3 bg-white rounded-lg p-2 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              {t("emptyFoldersTitle", {}, locale)}（{emptyFolders.length}）
            </span>
            <button
              className="text-xs text-red-500 hover:text-red-600"
              onClick={deleteAllEmptyFolders}
              disabled={loading}
            >
              {t("deleteAll", {}, locale)}
            </button>
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {emptyFolders.map((folder) => (
              <div
                key={folder.id}
                className="flex items-center justify-between text-xs text-gray-700"
              >
                <span className="truncate mr-2">
                  {folder.title || t("unnamedFolder", {}, locale)}
                </span>
                <button
                  className="text-red-400 hover:text-red-600 shrink-0"
                  onClick={() => deleteEmptyFolder(folder.id)}
                  disabled={loading}
                >
                  {t("delete", {}, locale)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <StatusMessage status={status} />
      <StreamingContent content={streamingContent} />
      <CategoryResults categories={categories} />
      <SettingsPanel
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        apiConfig={apiConfig}
        setApiConfig={setApiConfig}
        saveApiConfig={saveApiConfig}
        handlePresetChange={handlePresetChange}
      />
    </div>
  );
}

export default App;