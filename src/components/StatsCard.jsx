import { useLocale } from "../i18n/useLocale";
import { t } from "../i18n/translations";

export function StatsCard({ stats }) {
  const { locale } = useLocale();

  return (
    <div className="flex justify-around bg-white rounded-lg p-3 mb-4 shadow-sm">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-500">{stats.bookmarks}</div>
        <div className="text-xs text-gray-500">{t("totalBookmarks", {}, locale)}</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-500">{stats.folders}</div>
        <div className="text-xs text-gray-500">{t("folders", {}, locale)}</div>
      </div>
    </div>
  );
}