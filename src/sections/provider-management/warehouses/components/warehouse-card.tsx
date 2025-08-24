"use client";

import { Warehouse } from "@/types/warehouses";
import Badge from "@/components/badge/badge";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import clsx from "clsx";
import { MapPinIcon, PencilSquareIcon, EyeIcon, TrashIcon, CubeIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { VIRTUAL_WAREHOUSE_UI_MOCK } from "./virtual-warehouse-mock";

interface WarehouseCardProps {
  warehouse: Warehouse;
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (warehouse: Warehouse) => void;
}

export function WarehouseCard({
  warehouse,
  onEdit,
  onDelete,
}: WarehouseCardProps) {
  const router = useRouter();
  const handleView = () =>
    router.push(paths.provider.warehouse.view(warehouse.id));
  const handleEdit = () => {
    if (onEdit) return onEdit(warehouse);
    router.push(paths.provider.warehouse.edit(warehouse.id));
  };
  const handleDelete = () => {
    if (onDelete) onDelete(warehouse);
  };

  // En contexto proveedor solo existen almacenes virtuales
  const TypeIcon = BuildingOfficeIcon;

  const getStatusColor = () => {
    switch (warehouse.status) {
      case "active":
        return "badge-outline-success";
      case "maintenance":
        return "badge-outline-warning";
      default:
        return "badge-outline-secondary";
    }
  };

  const getStatusText = () => {
    switch (warehouse.status) {
      case "active":
        return "Activo";
      case "maintenance":
        return "Mantenimiento";
      default:
        return "Inactivo";
    }
  };

  const getTypeBadge = () => "Virtual";
  const getTypeBadgeColor = () => "badge-outline-info";
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex gap-4 flex-col shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow h-full">
      {/* Header con icono y estado */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={clsx(
              "p-3 rounded-lg",
              "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            )}
          >
            <TypeIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary cursor-pointer truncate"
              onClick={handleView}
              title={warehouse.name}
            >
              {warehouse.name}
            </h3>
            {/* Tipo de ubicación principal: región, país */}
            {warehouse.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPinIcon className="h-4 w-4" />
                <span className="truncate">
                  {warehouse.location.region}
                  {warehouse.location.country ? `, ${warehouse.location.country}` : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Badge de tipo (Virtual / Físico) */}
        <Badge className={clsx(getTypeBadgeColor(), "text-xs flex-shrink-0")}>{getTypeBadge()}</Badge>
      </div>
      {/* Body - contenido que crece */}
      <div className="flex-grow space-y-4">
        {/* Capacidad utilizada */}
        {(() => {
          const mock = VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id];
          const max = mock?.maxCapacity ?? warehouse.maxCapacity;
          const cur = mock?.currentCapacity ?? warehouse.currentCapacity;
          const occ = mock?.occupancyPercentage ?? warehouse.occupancyPercentage ?? 0;
          return max;
        })() && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Capacidad utilizada</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {(() => {
                  const mock = VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id];
                  const occ = mock?.occupancyPercentage ?? warehouse.occupancyPercentage ?? 0;
                  return occ.toFixed(1);
                })()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={clsx(
                  "h-2 rounded-full transition-all",
                  ((VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id]?.occupancyPercentage ?? warehouse.occupancyPercentage ?? 0)) >= 90
                    ? "bg-red-500"
                    : ((VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id]?.occupancyPercentage ?? warehouse.occupancyPercentage ?? 0)) >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                )}
                style={{
                  width: `${Math.min((VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id]?.occupancyPercentage ?? warehouse.occupancyPercentage ?? 0), 100)}%`,
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(() => {
                const mock = VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id];
                const cur = mock?.currentCapacity ?? warehouse.currentCapacity ?? 0;
                const max = mock?.maxCapacity ?? warehouse.maxCapacity ?? 0;
                return `${cur.toLocaleString("es-ES")} / ${max.toLocaleString("es-ES")}`;
              })()}
            </div>
          </div>
        )}

        {/* Productos y estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <CubeIcon className="h-4 w-4" />
            <span className="text-sm">
              {(() => {
                const mock = VIRTUAL_WAREHOUSE_UI_MOCK[warehouse.id];
                const products = mock?.productsCount ?? warehouse.currentCapacity ?? 0;
                return `${products.toLocaleString("es-ES")} productos`;
              })()}
            </span>
          </div>
          <Badge className={clsx(getStatusColor(), "text-xs flex-shrink-0")}>{getStatusText()}</Badge>
        </div>
      </div>
      {/* Botones de acción - siempre al final */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
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
        {onDelete && (
          <button
            className="flex-1 min-w-[120px] py-2 px-3 rounded border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition inline-flex items-center justify-center gap-2"
            onClick={handleDelete}
            title="Eliminar almacén"
          >
            <TrashIcon className="h-4 w-4" />
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
