"use client";

import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

import {
  MapPinIcon,
  PencilSquareIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import { PackageIcon, Users2Icon, WarehouseIcon } from "lucide-react";
import Badge from "@/components/badge/badge";
import { cn } from "@/lib/utils";

interface WarehouseCardProps {
  warehouse: WarehouseFormData;
  onEdit?: (warehouse: WarehouseFormData) => void;
  onDelete?: (warehouse: WarehouseFormData) => void;
}

export function WarehouseCard({ warehouse, onEdit }: WarehouseCardProps) {
  const isPhysical =
    warehouse?.type?.toLowerCase() === WAREHOUSE_TYPE_ENUM.physical;

  const router = useRouter();
  const handleView = () =>
    router.push(paths.dashboard.warehouses.view(warehouse.id!));
  const handleEdit = () => {
    if (onEdit) return onEdit(warehouse);
    router.push(paths.dashboard.warehouses.edit(warehouse.id!));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-4 flex-col shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow h-full min-h-72">
      {/*  <pre> {JSON.stringify(warehouse, null, 2)} </pre> */}
      {/* Header con icono y estado */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "p-4 rounded-lg",
              warehouse.type === "physical"
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            )}
          >
            <WarehouseIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary cursor-pointer truncate"
              onClick={handleView}
              title={warehouse.name}
            >
              {warehouse.name}
            </h3>
            <div className="flex flex-row gap-1">
              <Badge variant={isPhysical ? "info" : "success"}>
                {isPhysical ? "Físico" : "Virtual"}
              </Badge>
              <Badge
                variant={
                  warehouse?.isActive ? "outline-info" : "outline-danger"
                }
              >
                {warehouse?.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {/* Body - contenido que crece */}
      <div className="flex flex-col gap-2">
        {/* Dirección */}
        {warehouse.locationId && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>{warehouse.locationName}</p>
            </div>
          </div>
        )}
        {warehouse.supplierId && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users2Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p>{warehouse.supplierName ?? "Proveedor"}</p>
            </div>
          </div>
        )}
        {warehouse.capacity && (
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <PackageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex flex-row gap-1 items-center">
              <p>{warehouse.capacity}</p>
              <p>({warehouse.capacityUnit})</p>
            </div>
          </div>
        )}
      </div>
      {/* Botones de acción - siempre al final */}
      <div className="flex flex-wrap gap-2  pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
        <button
          className="flex-1 min-w-[120px] py-2 px-3 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-flex items-center justify-center gap-2"
          onClick={handleEdit}
        >
          <PencilSquareIcon className="h-4 w-4" />
          Editar
        </button>
        <button
          className="flex-1 min-w-[120px] py-2 px-3 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-flex items-center justify-center gap-2"
          onClick={handleView}
        >
          <EyeIcon className="h-4 w-4" />
          Detalles
        </button>
      </div>
    </div>
  );
}
