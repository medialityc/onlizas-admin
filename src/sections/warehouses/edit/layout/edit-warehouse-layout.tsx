import React from "react";
import { EditWarehouseTabs } from "./edit-warehouse-tabs";
import { Warehouse } from "@/types/warehouses";
import EditHeader from "./edit-header";

function EditWarehouseLayout({
  warehouse,
  children,
}: {
  warehouse: Warehouse;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Header con información del almacén */}
      <EditHeader warehouse={warehouse} />

      {/* Tabs */}
      <EditWarehouseTabs activeTab="transfers" warehouse={warehouse} />

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {children}
      </div>
    </div>
  );
}

export default EditWarehouseLayout;
