"use client";

import { useRouter } from "next/navigation";

import {
  MapPinIcon,
  PencilSquareIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import { CalendarIcon, PackageIcon, Users2Icon } from "lucide-react";
import Badge from "@/components/badge/badge";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/button/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/cards/card";
import Link from "next/link";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface WarehouseCardProps {
  warehouse: WarehouseFormData;
  type: WAREHOUSE_TYPE_ENUM;
  onEdit?: () => void;
}

export function WarehouseCard({ warehouse, type, onEdit }: WarehouseCardProps) {
  const isPhysical = type === WAREHOUSE_TYPE_ENUM.physical;

  const router = useRouter();

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasEditPermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasTransferPermission = hasPermission([PERMISSION_ENUM.UPDATE]);

  const handleView = () => router.push(`warehouses/${type}/${warehouse.id!}`);
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
      return;
    }
    router.replace(`/dashboard/warehouses/${type}/${warehouse.id!}/edit`);
  };
  const handleTransfer = () => {
    router.replace(
      `/dashboard/warehouses/${type}/${warehouse.id!}/edit/transfers`
    );
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 h-full dark:border-slate-700">
      <CardHeader className="space-y-0 ">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "p-2 rounded-md w-16 h-16 flex flex-row items-center justify-center",
              type === WAREHOUSE_TYPE_ENUM.physical
                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            )}
          >
            {type === WAREHOUSE_TYPE_ENUM.physical ? (
              <BuildingStorefrontIcon className="h-10 w-10" />
            ) : (
              <BuildingOfficeIcon className="h-10 w-10" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/dashboard/warehouses/${type}/${warehouse.id!}`}
              className="text-base font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary cursor-pointer truncate"
              title={warehouse.name}
            >
              {warehouse.name}
            </Link>
            <div className="flex flex-wrap gap-1 mt-1">
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
              {warehouse?.isDeleted && (
                <Badge variant="danger">Eliminado</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body - contenido que crece */}
      <CardContent className="flex flex-col gap-2 flex-grow">
        {/* Tipo Virtual */}
        {warehouse.virtualTypeId && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <BuildingOfficeIcon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="truncate">{warehouse.virtualTypeName}</p>
            </div>
          </div>
        )}

        {/* Proveedor */}
        {warehouse.supplierId && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Users2Icon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="truncate">
                {warehouse.supplierName ?? "Proveedor"}
              </p>
            </div>
          </div>
        )}
        {/* Ubicación */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <MapPinIcon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="truncate">
              {warehouse?.locationName || "Sin localización"}
            </p>
          </div>
        </div>

        {/* Capacidad */}
        {warehouse.capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <PackageIcon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <div className="flex flex-row gap-1 items-center">
              <p>{warehouse.capacity}</p>
              <p className="text-gray-500 dark:text-gray-400">
                ({warehouse.capacityUnit})
              </p>
            </div>
          </div>
        )}
        {/* Fecha de actualización */}
        {warehouse.updatedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CalendarIcon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="truncate">
                Actualizado:{" "}
                {new Date(warehouse.updatedAt).toLocaleDateString("es-ES")}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Botones de acción - siempre al final */}
      <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
        {hasTransferPermission && (
          <Button
            outline
            variant="secondary"
            onClick={handleTransfer}
            className="w-full justify-center py-1.5 px-3 text-sm"
            size="sm"
          >
            <ArrowsRightLeftIcon className="h-3.5 w-3.5 mr-1.5" />
            Transferir
          </Button>
        )}
        {hasEditPermission && (
          <Button
            variant="primary"
            onClick={handleEdit}
            className="w-full justify-center py-1.5 px-3 text-sm"
            size="sm"
          >
            <PencilSquareIcon className="h-3.5 w-3.5 mr-1.5" />
            Editar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
