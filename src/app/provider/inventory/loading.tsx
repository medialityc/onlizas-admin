export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="panel space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Inventario - Admin
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestione el inventario de sus productos - Admin
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

          <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-60 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
