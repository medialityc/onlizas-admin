export default function LoadingBrands() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-3 w-72 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded border border-gray-100 p-3 dark:border-gray-800"
            >
              <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
