export function CategoryResults({ categories }) {
  if (Object.keys(categories).length === 0) return null;

  return (
    <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
      {Object.entries(categories).map(([category, subList], idx) => (
        <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
          <div className="font-semibold text-gray-800 flex items-center gap-2 mb-2 border-b pb-1">
            {category}
          </div>
          <div className="space-y-1">
            {subList.map((sub, subIdx) => (
              <div key={subIdx} className="ml-4 text-sm">
                <span className="text-blue-600 font-medium">
                  {sub.subCategory}
                </span>
                <span className="text-xs text-gray-400 ml-1">
                  ({sub.bookmarks.length})
                </span>
                <div className="text-xs text-gray-500 truncate">
                  {sub.bookmarks
                    .slice(0, 2)
                    .map((b) => b.title)
                    .join(" • ")}
                  {sub.bookmarks.length > 2 && "..."}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
