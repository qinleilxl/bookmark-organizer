import { useState, useEffect } from "react";
import { countBookmarks } from "../utils/bookmarks";

export function useBookmarkData() {
  const [stats, setStats] = useState({ bookmarks: 0, folders: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [categories, setCategories] = useState({});
  const [streamingContent, setStreamingContent] = useState("");
  const [operation, setOperation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const forceRefresh = () => setRefreshKey((k) => k + 1);

  const loadStats = async () => {
    try {
      const tree = await chrome.bookmarks.getTree();
      const { bookmarks, folders } = countBookmarks(tree);
      setStats({ bookmarks, folders });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadCategories = async () => {
    const result = await chrome.storage.local.get([
      "lastAnalysis",
      "operationStatus",
      "streamingContent",
    ]);

    if (result.lastAnalysis && typeof result.lastAnalysis === "object") {
      setCategories(result.lastAnalysis);
      if (result.operationStatus) {
        await chrome.storage.local.set({
          operationStatus: null,
          streamingContent: null,
        });
      }
    } else if (result.operationStatus) {
      setOperation(result.operationStatus);
      setLoading(true);
      setStatus({
        type: "loading",
        message:
          result.operationStatus === "analyzing"
            ? "正在分析书签..."
            : "正在整理书签...",
      });
    }

    if (result.streamingContent && result.operationStatus === "analyzing") {
      setStreamingContent(result.streamingContent);
    }
  };

  useEffect(() => {
    loadStats();
    loadCategories();

    const handleMessage = (message) => {
      if (message.type === "stream") setStreamingContent(message.content);
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return {
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
    loadCategories,
  };
}
