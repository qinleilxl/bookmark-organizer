import { BookOpen, Globe } from "lucide-react";
import { useLocale } from "../i18n/useLocale";
import { t } from "../i18n/translations";

export function Header() {
  const { locale, changeLocale } = useLocale();

  const toggleLocale = () => {
    changeLocale(locale === "zh" ? "en" : "zh");
  };

  return (
    <div className="text-center mb-4 relative">
      <h1 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
        <BookOpen className="w-5 h-5" />
        {t("appTitle", {}, locale)}
      </h1>
      <button
        onClick={toggleLocale}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        title={t("language", {}, locale)}
      >
        <Globe className="w-4 h-4" />
      </button>
    </div>
  );
}