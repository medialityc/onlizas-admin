import { DetailsSkeleton } from "@/components/skeletons/details-skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center animate-pulse">
        <div>
          <h1 className="text-2xl font-bold ">Detalles del producto</h1>
        </div>
        <div className="flex gap-2 animate-pulse">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 flex items-start gap-6 animate-pulse">
        <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <DetailsSkeleton
        title="Proveedores que usan este producto"
        rows={1}
        rowHeight={20}
      />
    </div>
  );
}
