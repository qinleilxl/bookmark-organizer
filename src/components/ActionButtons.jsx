import { Sparkles, Trash2, Folder, Loader2 } from "lucide-react";
import { useLocale } from "../i18n/useLocale";
import { t } from "../i18n/translations";

export function ActionButtons({
  loading,
  operation,
  hasCategories,
  onAnalyze,
  onDeduplicate,
  onOrganize,
  onFindEmptyFolders,
}) {
  const { locale } = useLocale();

  const buttonLabel =
    operation === "analyzing"
      ? t("analyzing", {}, locale)
      : operation === "organizing"
      ? t("organizing", {}, locale)
      : t("analyzeAndClassify", {}, locale);

  return (
    <div className="space-y-2 mb-4">
      <button
        onClick={onAnalyze}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {buttonLabel}
      </button>

      <button
        onClick={onDeduplicate}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-blue-500 border border-blue-500 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        {t("removeDuplicates", {}, locale)}
      </button>

      <button
        onClick={onFindEmptyFolders}
        disabled={loading}
        className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-amber-600 border border-amber-400 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        {t("findEmptyFolders", {}, locale)}
      </button>

      {hasCategories && !operation && (
        <button
          onClick={onOrganize}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Folder className="w-4 h-4" />
          {t("executeOrganize", {}, locale)}
        </button>
      )}
    </div>
  );
}