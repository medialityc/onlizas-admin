export default function Loading() {
  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight">
          Payment Methods
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Configure which payment methods are available to customers
        </p>
      </div>

      <div className="bg-slate-200/70 mt-4 sm:mt-6 sm:p-6 dark:bg-slate-950/50 dark:text-slate-100 shadow-lg rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-4 sm:p-6 pb-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Store Payment Configuration
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Enable and prioritize payment methods for your store
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 space-y-3 sm:space-y-0"
            >
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-shrink-0 self-center sm:self-auto" />
                <div className="h-5 w-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse flex-shrink-0 self-center sm:self-auto" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/5" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-4/5" />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              </div>
            </div>
          ))}

          <div className="sticky bottom-0 pt-4">
            <div className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </>
  );
}
