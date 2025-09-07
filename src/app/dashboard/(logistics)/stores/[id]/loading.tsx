export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">← Volver a Tiendas</div>
          <h1 className="mt-2 text-2xl font-semibold">Cargando la Tienda</h1>
        </div>
        <div className="hidden md:block">
          <div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Tabs bar */}
      <div className="w-full bg-white rounded-md border p-2">
        <div className="flex gap-3">
          <div className="h-8 w-32 rounded bg-gray-100 animate-pulse" />
          <div className="h-8 w-28 rounded bg-gray-100 animate-pulse" />
          <div className="h-8 w-28 rounded bg-gray-100 animate-pulse" />
          <div className="h-8 w-28 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div>
            <div className="h-6 w-16 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Two column info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-md border p-4 space-y-3">
          <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-9 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>

        <div className="bg-white rounded-md border p-4 space-y-3">
          <div className="h-5 w-44 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-9 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-9 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Policies large textarea */}
      <div className="bg-white rounded-md border p-4">
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-3" />
        <div className="h-40 w-full bg-gray-100 rounded animate-pulse" />
      </div>

      <div className="flex justify-end">
        <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
