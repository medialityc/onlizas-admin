import { Suspense } from "react";
import Loader from "@/components/loaders/loader";
import EditWarehouseTransfersContent from "@/sections/warehouses/edit/transfer/edit-warehouse-transfer-content";

function EditWarehouseTransfersLoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}

export default async function EditWarehouseTransfersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditWarehouseTransfersLoadingFallback />}>
      <EditWarehouseTransfersContent id={id} />
    </Suspense>
  );
}
