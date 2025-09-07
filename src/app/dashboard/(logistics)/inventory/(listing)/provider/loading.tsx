export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="panel space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Usuarios proveedores
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestionar inventario seleccionando el usuario proveedor
          </p>
        </div>

        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

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
