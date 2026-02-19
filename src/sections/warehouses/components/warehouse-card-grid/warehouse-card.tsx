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
  route: WAREHOUSE_TYPE_ENUM;
  onEdit?: () => void;
}

export function WarehouseCard({
  warehouse,
  route,
  onEdit,
}: WarehouseCardProps) {
  const isPhysical = route === WAREHOUSE_TYPE_ENUM.warehouse;
  const router = useRouter();

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasEditPermission = hasPermission([
    PERMISSION_ENUM.UPDATE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);
  const hasTransferPermission = hasPermission([
    PERMISSION_ENUM.CREATE,
    PERMISSION_ENUM.SUPPLIER_CREATE,
  ]);
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
      return;
    }
    router.replace(`/dashboard/warehouses/${route}/${warehouse.id!}/edit`);
  };
  const handleTransfer = () => {
    router.replace(
      `/dashboard/warehouses/${route}/${warehouse.id!}/edit/transfers`,
    );
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/10 h-full min-h-[230px] md:min-h-[260px] dark:border-slate-700 bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <CardHeader className="space-y-0 px-5 pt-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "p-2 rounded-md w-16 h-16 flex flex-row items-center justify-center",
              isPhysical
                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            )}
          >
            {!isPhysical ? (
              <BuildingStorefrontIcon className="h-10 w-10" />
            ) : (
              <BuildingOfficeIcon className="h-10 w-10" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/dashboard/warehouses/${route}/${warehouse.id!}`}
              className="block w-full text-lg md:text-xl font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary cursor-pointer truncate"
              title={warehouse.name}
            >
              <span className="block w-full truncate">{warehouse.name}</span>
            </Link>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant={isPhysical ? "info" : "success"}>
                {isPhysical ? "General" : "Para proveedor"}
              </Badge>
              {/* <Badge
                variant={warehouse?.active ? "outline-info" : "outline-danger"}
              >
                {warehouse?.active ? "Activo" : "Inactivo"}
              </Badge> */}
              {warehouse?.isDeleted && (
                <Badge variant="danger">Eliminado</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body - contenido que crece */}
      <CardContent className="flex flex-col gap-4 flex-grow px-5 pb-4 pt-1">
        {/* Tipo Virtual */}
        {warehouse.virtualTypeName && (
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
        {/* Dirección enriquecida */}
        {warehouse.address && (
          <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-md border border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-900/40 px-2.5 py-2">
            <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <div className="space-y-0.5 min-w-0">
              <p className="font-medium truncate">
                {warehouse.address?.name || "Sin alias de dirección"}
              </p>
              <p className="truncate text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                {[warehouse.address.mainStreet, warehouse.address.number]
                  .filter(Boolean)
                  .join(" ") || "Calle principal no registrada"}
              </p>
              <p className="truncate text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                {[warehouse.address.city, warehouse.address.zipcode]
                  .filter(Boolean)
                  .join(", ") || "Ciudad no registrada"}
              </p>
              {warehouse.address.difficultAccessArea && (
                <p className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Zona de difícil acceso
                </p>
              )}
            </div>
          </div>
        )}

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
      <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-5 pb-4 pt-0">
        {hasTransferPermission && (
          <Button
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
