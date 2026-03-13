import { Loader2 } from "lucide-react";
import { useLocale } from "../i18n/useLocale";
import { t } from "../i18n/translations";

export function StreamingContent({ content }) {
  const { locale } = useLocale();
  if (!content) return null;

  return (
    <div className="mb-4 p-3 bg-white rounded-lg shadow-sm">
      <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        {t("aiAnalyzing", {}, locale)}
      </div>
      <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all max-h-32 overflow-y-auto font-mono">
        {content}
      </pre>
    </div>
  );
}