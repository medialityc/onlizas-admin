import React, { Suspense } from "react";
import { EditWarehouseTabs } from "./edit-warehouse-tabs";
import EditHeader from "./edit-header";
import Loader from "@/components/loaders/loader";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import { Tab } from "@/types/tabs";
function EditWarehouseLoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}

type Props = React.PropsWithChildren & {
  onTabs?: (warehouseId: number, type: WAREHOUSE_TYPE_ENUM) => Tab[];
  warehouse: WarehouseFormData;
};
function EditWarehouseLayout({ warehouse, children, onTabs }: Props) {
  return (
    <div className="space-y-4">
      {/* Header con información del almacén */}
      <EditHeader warehouse={warehouse} />

      {/* Tabs */}
      <EditWarehouseTabs warehouse={warehouse} onTabs={onTabs} />

      <Suspense fallback={<EditWarehouseLoadingFallback />}>
        {children}
      </Suspense>
    </div>
  );
}

export default EditWarehouseLayout;
