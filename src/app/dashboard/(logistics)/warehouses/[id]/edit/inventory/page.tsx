import { Suspense } from "react";
import Loader from "@/components/loaders/loader";
import EditWarehouseInventoryContent from "@/sections/warehouses/edit/inventory/edit-warehouse-content";

function EditWarehouseInventoryLoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}

export default async function EditWarehouseInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditWarehouseInventoryLoadingFallback />}>
      <EditWarehouseInventoryContent id={id} />
    </Suspense>
  );
}
