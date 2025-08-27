import React, { Suspense } from "react";
import { EditWarehouseTabs } from "./edit-warehouse-tabs";
import EditHeader from "./edit-header";
import Loader from "@/components/loaders/loader";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
function EditWarehouseLoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}
function EditWarehouseLayout({
  warehouse,
  children,
}: {
  warehouse: WarehouseFormData;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Header con información del almacén */}
      <EditHeader warehouse={warehouse} />

      {/* Tabs */}
      <EditWarehouseTabs warehouse={warehouse} />
      <Suspense fallback={<EditWarehouseLoadingFallback />}>
        {children}
      </Suspense>
    </div>
  );
}

export default EditWarehouseLayout;
