export default function Loading() {
  return (
    <div className="panel animate-pulse">
      <div className="mb-5 flex items-center justify-start gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-400">
            Cargando Inventario…
          </h2>
          <p className="text-sm text-gray-300">
            Preparando la información del proveedor
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="w-full bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 h-20"
              ></div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 h-32"
            >
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
