import React from "react";
import BackButton from "./back-button";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { WarehouseIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function EditHeader({ warehouse }: { warehouse: WarehouseFormData }) {
  const getStatusInfo = () => {
    switch (warehouse.isActive) {
      case true:
        return {
          label: "Activo",
          class:
            "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/50",
        };

      default:
        return {
          label: "Inactivo",
          class:
            "bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-900/30 dark:text-rose-200 dark:ring-rose-800/50",
        };
    }
  };

  const statusInfo = getStatusInfo();

  const iconBgColor =
    warehouse.type === "physical"
      ? "bg-gradient-to-br from-purple-500 to-purple-600"
      : "bg-gradient-to-br from-blue-500 to-indigo-600";

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 animate-slideUp">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg",
                iconBgColor
              )}
            >
              <WarehouseIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {warehouse.name}
              </h1>
              <div className="flex flex-row gap-2 items-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusInfo.class}`}
                  aria-label={`Estado: ${statusInfo.label}`}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  {statusInfo.label}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-300 dark:bg-gray-800/50 dark:text-gray-200 dark:ring-gray-700/50">
                  {warehouse.type === "physical" ? "Físico" : "Virtual"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <BackButton />
        </div>
      </div>
    </div>
  );
}

export default EditHeader;
