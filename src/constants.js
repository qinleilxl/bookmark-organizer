// Default API presets
export const API_PRESETS = [
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
  { name: "Custom", url: "", model: "" },
];
