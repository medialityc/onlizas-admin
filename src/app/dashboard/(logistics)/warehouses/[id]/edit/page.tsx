import { Suspense } from "react";
import Loader from "@/components/loaders/loader";
import EditWarehouseContent from "@/sections/warehouses/edit/general-data/edit-warehouse-general-content";

function EditWarehouseLoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}

export default async function EditWarehousePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditWarehouseLoadingFallback />}>
      <EditWarehouseContent id={id} />
    </Suspense>
  );
}
