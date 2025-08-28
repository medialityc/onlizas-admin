import { Suspense } from "react";
import { WarehouseDetails } from "@/sections/warehouses/view/warehouse-details";
import { getWarehouseById } from "@/services/warehouses";
import { notFound } from "next/navigation";

function WarehouseViewFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

type PageProps = {
  params: Promise<{ id: string; type: string }>;
};

export default async function ViewWarehousePage({ params }: PageProps) {
  const { id, type } = await params;

  const response = await getWarehouseById(Number(id), type);
  if (!response?.data) notFound();

  return (
    <Suspense fallback={<WarehouseViewFallback />}>
      <WarehouseDetails warehouse={response.data} />
    </Suspense>
  );
}
