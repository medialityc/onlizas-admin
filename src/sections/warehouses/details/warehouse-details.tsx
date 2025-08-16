import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { paths } from "@/config/paths";
import { getWarehouseById } from "@/services/warehouses-mock";
import {
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { notFound } from "next/navigation";

function getTypeIcon(type: string) {
  return type === "physical" ? BuildingStorefrontIcon : BuildingOfficeIcon;
}

export default async function WarehouseDetails({ id }: { id: string }) {
  const response = await getWarehouseById(Number(id));
  if (!response?.data) notFound();
  const w = response.data;
  const occupancy = w.maxCapacity
    ? Math.round(((w.currentCapacity || 0) / w.maxCapacity) * 100)
    : undefined;
  const TypeIcon = getTypeIcon(w.type);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={
              w.type === "physical"
                ? "p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                : "p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            }
          >
            <TypeIcon className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
              {w.name}
              <Badge
                className="ml-2"
                variant={
                  w.status === "active"
                    ? "success"
                    : w.status === "maintenance"
                      ? "warning"
                      : "secondary"
                }
              >
                {w.status === "active"
                  ? "Activo"
                  : w.status === "maintenance"
                    ? "Mantenimiento"
                    : "Inactivo"}
              </Badge>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate">
              {w.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={paths.dashboard.warehouses.edit(w.id)}>
            <Button>Editar</Button>
          </Link>
          <Link href={paths.dashboard.warehouses.list}>
            <Button variant="secondary" outline>
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Tipo:
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {w.type === "physical" ? "Físico" : "Virtual"}
            </span>
          </div>
          {w.type === "physical" && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Capacidad:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {w.currentCapacity || 0} / {w.maxCapacity || 0}
                </span>
                {occupancy !== undefined && (
                  <span className="text-xs text-gray-500">({occupancy}%)</span>
                )}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={
                    (occupancy || 0) >= 90
                      ? "bg-red-500"
                      : (occupancy || 0) >= 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }
                  style={{
                    width: `${Math.min(occupancy || 0, 100)}%`,
                    height: "0.5rem",
                    borderRadius: "9999px",
                    transition: "width 0.3s",
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {occupancy || 0}% ocupado
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Gestor/Proveedor:
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {w.managerName || "No asignado"}
            </span>
          </div>
        </div>
        {/* Columna derecha */}
        <div className="space-y-6">
          {w.location?.address && (
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 mt-0.5 text-gray-400" />
              <div>
                <div className="font-semibold text-gray-700 dark:text-gray-200">
                  Ubicación:
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {w.location.address}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {w.location.region}, {w.location.country}
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              Creado:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {new Date(w.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 dark:text-gray-200">
              Actualizado:
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {new Date(w.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
