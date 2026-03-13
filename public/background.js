// Service Worker - 在后台处理 AI 请求

const API_PRESETS = [
  {
    name: "OpenAI",
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
  },
  {
    name: "Anthropic",
    url: "https://api.anthropic.com/v1/messages",
    model: "claude-3-haiku-20240307",
  },
  { name: "Ollama", url: "http://localhost:11434/api/chat", model: "llama3" },
];

// 扁平化书签
function flattenBookmarks(nodes, result = []) {
  nodes.forEach((node) => {
    if (node.children) {
      flattenBookmarks(node.children, result);
    } else if (node.url) {
      result.push({
        id: node.id,
        title: node.title,
        url: node.url,
        parentId: node.parentId,
      });
    }
  });
  return result;
}

// 规则分类
function analyzeWithRules(bookmarks) {
  const rules = {
    技术: {
      前端: [
        "html",
        "css",
        "javascript",
        "js",
        "react",
        "vue",
        "angular",
        "webpack",
        "vite",
        "typescript",
        "前端",
        "front-end",
        "frontend",
        "ui",
      ],
      后端: [
        "java",
        "python",
        "node",
        "golang",
        "rust",
        "php",
        "后端",
        "backend",
        "server",
        "api",
      ],
      AI: [
        "ai",
        "gpt",
        "chatgpt",
        "claude",
        "llm",
        "machine learning",
        "ai",
        "人工智能",
        "openai",
        "anthropic",
        "ollama",
        "model",
        "deepseek",
      ],
      数据库: [
        "mysql",
        "postgres",
        "mongodb",
        "redis",
        "sql",
        "database",
        "数据库",
      ],
      DevOps: [
        "docker",
        "kubernetes",
        "k8s",
        "git",
        "ci",
        "cd",
        "jenkins",
        "linux",
        "nginx",
        "devops",
      ],
      硬件: ["arduino", "raspberry", "硬件", "嵌入式"],
    },
    新闻: {
      科技: ["tech", "科技", "36kr", "ifanr"],
      财经: ["finance", "财经", "股票", "雪球"],
      国际: ["bbc", "cnn", "reuters", "新闻"],
    },
    购物: {
      综合: ["taobao", "jd.com", "amazon", "pinduoduo", "商城"],
      数码: ["京东", "苏宁", "数码"],
      二手: ["闲鱼", "二手"],
    },
    娱乐: {
      视频: [
        "youtube",
        "bilibili",
        "netflix",
        "视频",
        "douyin",
        "抖音",
        "西瓜",
      ],
      电影: ["电影", "movie", "imdb"],
      音乐: ["music", "音乐", "网易云", "spotify"],
      游戏: ["game", "游戏", "steam", "epic"],
    },
    社交: {
      国外: ["twitter", "facebook", "instagram", "telegram", "discord"],
      国内: ["weibo", "xiaohongshu", "微信", "qq"],
    },
    工具: {
      开发: [
        "tool",
        "工具",
        "convert",
        "generator",
        "formatter",
        "regex",
        "json",
      ],
      效率: ["notion", "obsidian", "笔记", "todo", "calendar"],
      设计: ["figma", "sketch", "photoshop", "设计", "canva"],
    },
    学习: {
      教程: ["教程", "tutorial", "course", "udemy", "coursera", "mooc"],
      文档: ["docs", "documentation", "mdn", "doc"],
      社区: ["stackoverflow", "juejin", "掘金", "segmentfault", "知乎"],
    },
    金融: {
      银行: ["bank", "银行", "招商", "工商"],
      投资: ["投资", "理财", "雪球", "基金"],
      支付: ["alipay", "wechatpay", "支付"],
    },
    生活: {
      美食: ["美食", "dianping", "meituan", "大众点评"],
      旅行: ["travel", "旅行", "旅游", "airbnb", "booking"],
      健康: ["健康", "医疗", "丁香"],
      天气: ["天气", "weather"],
    },
  };

  const categories = {};
  bookmarks.forEach((bookmark) => {
    // javascript: 开头的书签忽略 URL 部分，避免过长文本影响分类
    const urlPart = bookmark.url?.startsWith("javascript:")
      ? ""
      : bookmark.url || "";
    const text = (bookmark.title + " " + urlPart).toLowerCase();
    let assigned = false;
    for (const [category, subRules] of Object.entries(rules)) {
      for (const [subCategory, keywords] of Object.entries(subRules)) {
        if (keywords.some((k) => text.includes(k))) {
          const key = `${category}|${subCategory}`;
          if (!categories[key])
            categories[key] = { category, subCategory, bookmarks: [] };
          categories[key].bookmarks.push(bookmark);
          assigned = true;
          break;
        }
      }
      if (assigned) break;
    }
    if (!assigned) {
      const key = "其他|未分类";
      if (!categories[key])
        categories[key] = {
          category: "其他",
          subCategory: "未分类",
          bookmarks: [],
        };
      categories[key].bookmarks.push(bookmark);
    }
  });

  const result = {};
  Object.values(categories).forEach((item) => {
    if (!result[item.category]) result[item.category] = [];
    result[item.category].push({
      subCategory: item.subCategory,
      bookmarks: item.bookmarks,
    });
  });
  return result;
}

// AI 分类（分批处理）
async function analyzeWithAI(bookmarks, config) {
  const BATCH_SIZE = 50;
  const allResults = {};

  const batches = [];
  for (let i = 0; i < bookmarks.length; i += BATCH_SIZE) {
    batches.push(bookmarks.slice(i, i + BATCH_SIZE));
  }

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchNum = batchIndex + 1;
    const totalBatches = batches.length;

    chrome.runtime
      .sendMessage({
        type: "stream",
        content: `正在处理第 ${batchNum}/${totalBatches} 批书签...`,
      })
      .catch(() => {});

    const batchResult = await processBatch(
      batch,
      config,
      batchIndex === 0 ? null : allResults
    );

    for (const [category, subCategories] of Object.entries(batchResult)) {
      if (!allResults[category]) {
        allResults[category] = [];
      }
      for (const sub of subCategories) {
        const existingSub = allResults[category].find(
          (s) => s.subCategory === sub.subCategory
        );
        if (existingSub) {
          existingSub.bookmarks.push(...sub.bookmarks);
        } else {
          allResults[category].push(sub);
        }
      }
    }
  }

  const filtered = {};
  for (const [category, subCategories] of Object.entries(allResults)) {
    const validSubList = subCategories.filter(
      (sub) => sub.bookmarks.length > 0
    );
    if (validSubList.length > 0) {
      filtered[category] = validSubList;
    }
  }

  return filtered;
}

// 处理单批书签
async function processBatch(bookmarks, config, existingCategories) {
  const formatBookmark = (b) => {
    const title = b.title || "";
    if (b.url && b.url.startsWith("javascript:")) {
      return title;
    }
    const url =
      b.url && b.url.length > 200 ? b.url.substring(0, 200) + "..." : b.url;
    return url ? `${title} (${url})` : title;
  };

  const bookmarkTexts = bookmarks.map(formatBookmark).join("\n");

  let categoryInstruction = "";
  if (existingCategories && Object.keys(existingCategories).length > 0) {
    const categoryNames = Object.keys(existingCategories).join(", ");
    const subCategories = [];
    for (const [cat, subs] of Object.entries(existingCategories)) {
      for (const sub of subs) {
        subCategories.push(`${cat}: ${sub.subCategory}`);
      }
    }
    categoryInstruction = `\n\nIMPORTANT: Use EXISTING categories below. Do NOT create new category names:\n- Top-level: ${categoryNames}\n- Subcategories: ${subCategories.join(
      "; "
    )}`;
  }

  const prompt = `You are an information architect specialized in organizing browser bookmarks.

Your task: read the following list of bookmarks and design meaningful top-level categories and subcategories. Then output only one JSON object.

1. Category design
- Use short, clear category names (Technology, Learning, Entertainment, Tools, etc.)
- Each bookmark must belong to exactly one top-level category and one subcategory.
- For hard-to-classify use "Other" or "Uncategorized" subcategory.
- ${
    existingCategories
      ? "IMPORTANT: Use ONLY the existing categories provided below."
      : "Aim for roughly 5-12 top-level categories."
  }${categoryInstruction}

2. Output language
- Detect the dominant language. If Chinese detected, use Chinese names. Otherwise use English.

3. Output format
{
  "CategoryName": [
    {
      "subCategory": "SubCategoryName",
      "bookmarks": [
        { "title": "Original title", "url": "Original URL" }
      ]
    }
  ]
}
- Only output the JSON. No explanations, no markdown.

Now classify:

${bookmarkTexts}`;

  //   const prompt = `You are an information architect specialized in organizing browser bookmarks.

  // Your task: read the following list of bookmarks and design **meaningful top-level categories and subcategories** based on their topics and usage scenarios. Then output **only one** JSON object that strictly follows the rules below.

  // 1. Category design
  // - You are free to design the top-level category names (for example: Technology, Learning, Video & Entertainment, Shopping & Deals, Productivity Tools, etc.). Names should be short, clear, and topic-focused.
  // - Under each top-level category you may create multiple subcategories (for example:
  //   - Technology: Frontend, Backend, AI, Database, DevOps, Hardware
  //   - Learning: Tutorials, Documentation, Communities
  //   - Entertainment: Video, Movies, Music, Games
  //   - Tools: Developer Tools, Productivity Tools, Design Tools
  //   - ... You may design any other names that better fit the actual bookmarks.).
  // - Each bookmark MUST belong to **exactly one** top-level category and **exactly one** subcategory. No duplicates across categories.
  // - If a bookmark logically belongs to multiple categories, choose the one that best reflects **the user’s most likely purpose** when using it.
  // - For hard-to-classify bookmarks you may use an “Other” or “Uncategorized” subcategory under a reasonable top-level category, but keep such buckets as small as possible.
  // - Aim for roughly **5–12** top-level categories: not too few (overly broad), not too many (overly fragmented).

  // 2. Output language
  // - Detect the dominant language of the bookmark titles/URLs (and any hints in the data).
  // - If the user/system appears to use Chinese, then write all category and subcategory names in **Chinese**.
  // - Otherwise, write category and subcategory names in **English**.
  // - Bookmark titles and URLs in the output must stay exactly as in the input (do NOT translate or modify them).

  // 3. Output format (must follow exactly)
  // - The top-level structure is a JSON object. Each key is a top-level category name (for example: "Technology", "学习资料", "Video Entertainment", etc.).
  // - Each top-level category value is an array of objects with the following shape:
  //   {
  //     "subCategory": "Name of the subcategory",
  //     "bookmarks": [
  //       { "title": "Original title", "url": "Original URL" }
  //     ]
  //   }
  // - Only output categories and subcategories that actually contain bookmarks. Do NOT output empty arrays or empty categories.
  // - Do NOT output anything outside of the JSON object. No explanations, no comments, no markdown code blocks.
  // - Bookmark title and url fields must come exactly from the input. Do NOT invent, translate, or modify them.

  // 4. Example structure (for structure only; do NOT copy these names or values)
  // {
  //   "Technology": [
  //     {
  //       "subCategory": "Frontend",
  //       "bookmarks": [
  //         { "title": "Some frontend tutorial", "url": "https://example.com/front" }
  //       ]
  //     },
  //     {
  //       "subCategory": "AI",
  //       "bookmarks": [
  //         { "title": "Some AI blog", "url": "https://example.com/ai" }
  //       ]
  //     }
  //   ],
  //   "Entertainment": [
  //     {
  //       "subCategory": "Video",
  //       "bookmarks": [
  //         { "title": "Some video site", "url": "https://example.com/video" }
  //       ]
  //     }
  //   ]
  // }

  // Now classify the following bookmarks and return only one JSON object that satisfies all the rules above:

  // Bookmarks:
  // ${bookmarkTexts}`;

  const isOllama =
    config.url.includes("localhost") || config.url.includes("ollama");
  const isAnthropic = config.url.includes("anthropic");

  const headers = { "Content-Type": "application/json" };
  let body = {};

  if (isOllama) {
    body = {
      model: config.model,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    };
  } else if (isAnthropic) {
    headers["x-api-key"] = config.key;
    headers["anthropic-version"] = "2023-06-01";
    body = {
      model: config.model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    };
  } else {
    // OpenAI 兼容格式
    headers["Authorization"] = `Bearer ${config.key}`;
    body = {
      model: config.model,
      stream: true,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
    };
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }

  // 流式响应处理
  if (body.stream && !isAnthropic) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          const content = isOllama
            ? json.message?.content
            : json.choices?.[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            // 发送进度更新
            chrome.runtime
              .sendMessage({ type: "stream", content: fullContent })
              .catch(() => {});
          }
        } catch (e) {}
      }
    }
    return parseBatchResult(fullContent, bookmarks);
  } else {
    const data = await response.json();
    let resultText;

    if (isAnthropic) {
      resultText = data.content[0].text;
    } else if (isOllama) {
      resultText = data.message.content;
    } else {
      resultText = data.choices[0].message.content;
    }

    return parseBatchResult(resultText, bookmarks);
  }
}

// 解析单批结果（不 fallback 到规则分类）
function parseBatchResult(content, bookmarks) {
  try {
    const result = JSON.parse(content);
    const transformed = {};
    for (const [category, subList] of Object.entries(result)) {
      transformed[category] = subList.map((sub) => ({
        subCategory: sub.subCategory,
        bookmarks: sub.bookmarks
          .map((b) =>
            bookmarks.find(
              (bookmark) => bookmark.url === b.url || bookmark.title === b.title
            )
          )
          .filter(Boolean),
      }));
    }
    return transformed;
  } catch (e) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const result = JSON.parse(match[0]);
        return filterEmptyCategories(result, bookmarks);
      } catch (e2) {}
    }
    console.log("Batch parse error:", e);
    return {};
  }
}

function parseResult(content, bookmarks) {
  try {
    const result = JSON.parse(content);
    const transformed = {};
    for (const [category, subList] of Object.entries(result)) {
      transformed[category] = subList.map((sub) => ({
        subCategory: sub.subCategory,
        bookmarks: sub.bookmarks
          .map((b) =>
            bookmarks.find(
              (bookmark) => bookmark.url === b.url || bookmark.title === b.title
            )
          )
          .filter(Boolean),
      }));
    }
    console.log(">>>>>>> transformed:", transformed);
    return transformed;
  } catch (e) {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const result = JSON.parse(match[0]);
        return filterEmptyCategories(result, bookmarks);
      } catch (e2) {}
    }
    console.log(">>>>>>> error:", e, content);
    return analyzeWithRules(bookmarks); // fallback
  }
}

// 过滤掉空的分类
function filterEmptyCategories(result, bookmarks) {
  const filtered = {};
  for (const [category, subList] of Object.entries(result)) {
    const validSubList = [];
    for (const sub of subList) {
      // 重新匹配书签
      const matchedBookmarks = sub.bookmarks
        .map((b) =>
          bookmarks.find(
            (bookmark) => bookmark.url === b.url || bookmark.title === b.title
          )
        )
        .filter(Boolean);

      if (matchedBookmarks.length > 0) {
        validSubList.push({
          subCategory: sub.subCategory,
          bookmarks: matchedBookmarks,
        });
      }
    }

    // 只有当有非空子类时才保留
    if (validSubList.length > 0) {
      filtered[category] = validSubList;
    }
  }
  return filtered;
}

// 消息处理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyze") {
    console.log(
      "[Background] 收到分析请求, bookmark数:",
      message.bookmarks?.length
    );
    (async () => {
      try {
        const { apiConfig, bookmarks } = message;

        let result;
        if (apiConfig.key || apiConfig.url.includes("ollama")) {
          console.log("[Background] 使用 AI 分类...");
          result = await analyzeWithAI(bookmarks, apiConfig);
        } else {
          console.log("[Background] 使用规则分类...");
          result = analyzeWithRules(bookmarks);
        }

        // 过滤空分类
        result = filterEmptyCategories(result, bookmarks);

        // 保存结果
        await chrome.storage.local.set({
          lastAnalysis: result,
          operationStatus: null,
          streamingContent: null,
        });

        console.log("[Background] 发送成功响应");
        sendResponse({ success: true, result });
      } catch (error) {
        console.error("[Background] 分析失败:", error);
        await chrome.storage.local.set({
          operationStatus: null,
          streamingContent: null,
        });
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }
});
