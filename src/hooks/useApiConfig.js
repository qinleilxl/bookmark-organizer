import { useState, useEffect } from "react";
import { API_PRESETS } from "../constants";

const defaultConfig = {
  preset: 0,
  url: API_PRESETS[0].url,
  model: API_PRESETS[0].model,
  key: "",
};

export function useApiConfig() {
  const [apiConfig, setApiConfig] = useState(defaultConfig);

  useEffect(() => {
    (async () => {
      const result = await chrome.storage.local.get(["apiConfig"]);
      if (result.apiConfig) setApiConfig(result.apiConfig);
    })();
  }, []);

  const saveApiConfig = async () => {
    await chrome.storage.local.set({ apiConfig });
  };

  const handlePresetChange = (index) => {
    const preset = API_PRESETS[index];
    setApiConfig((prev) => ({
      ...prev,
      preset: index,
      url: preset.url,
      model: preset.model,
    }));
  };

  return { apiConfig, setApiConfig, saveApiConfig, handlePresetChange };
}
