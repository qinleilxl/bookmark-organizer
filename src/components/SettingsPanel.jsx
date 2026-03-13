import { Settings } from "lucide-react";
import { API_PRESETS } from "../constants";
import { useLocale } from "../i18n/useLocale";
import { t } from "../i18n/translations";

export function SettingsPanel({
  showSettings,
  onToggleSettings,
  apiConfig,
  setApiConfig,
  saveApiConfig,
  handlePresetChange,
}) {
  const { locale } = useLocale();
  return (
    <>
      <button
        onClick={onToggleSettings}
        className="w-full py-2 text-sm text-gray-500 flex items-center justify-center gap-1 hover:text-gray-700"
      >
        <Settings className="w-4 h-4" />
        {showSettings
          ? t("collapseSettings", {}, locale)
          : t("expandSettings", {}, locale)}
      </button>

      {showSettings && (
        <div className="border-t border-gray-200 pt-3 space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("apiPreset", {}, locale)}
            </label>
            <select
              value={apiConfig.preset}
              onChange={(e) => handlePresetChange(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {API_PRESETS.map((preset, idx) => (
                <option key={idx} value={idx}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("apiUrl", {}, locale)}
            </label>
            <input
              type="text"
              value={apiConfig.url}
              onChange={(e) =>
                setApiConfig((prev) => ({ ...prev, url: e.target.value }))
              }
              onBlur={saveApiConfig}
              placeholder="https://api.openai.com/v1/chat/completions"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("model", {}, locale)}
            </label>
            <input
              type="text"
              value={apiConfig.model}
              onChange={(e) =>
                setApiConfig((prev) => ({ ...prev, model: e.target.value }))
              }
              onBlur={saveApiConfig}
              placeholder="gpt-3.5-turbo"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {t("apiKey", {}, locale)}
            </label>
            <input
              type="password"
              value={apiConfig.key}
              onChange={(e) =>
                setApiConfig((prev) => ({ ...prev, key: e.target.value }))
              }
              onBlur={saveApiConfig}
              placeholder={t("apiKeyPlaceholder", {}, locale)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-xs text-gray-400">
            {t("noApiKeyHint", {}, locale)}
          </p>
        </div>
      )}
    </>
  );
}
