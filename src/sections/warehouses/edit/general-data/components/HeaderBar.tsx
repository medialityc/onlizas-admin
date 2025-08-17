"use client";

import { useFormContext } from "react-hook-form";
import {
  BuildingLibraryIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function HeaderBar() {
  const { watch } = useFormContext();
  const watchedType = watch("type");
  const watchedStatus = watch("status");

  return (
    <div className="flex items-start justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 p-2">
          <BuildingLibraryIcon className="w-5 h-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Datos generales del almacén
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edita la información básica, capacidad, ubicación y responsable del
            almacén.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium " +
            (watchedType === "virtual"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300")
          }
        >
          <Cog6ToothIcon className="w-4 h-4" />
          {watchedType === "virtual" ? "Virtual" : "Físico"}
        </span>
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium " +
            (watchedStatus === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : watchedStatus === "maintenance"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300")
          }
        >
          {watchedStatus === "active"
            ? "Activo"
            : watchedStatus === "maintenance"
              ? "Mantenimiento"
              : "Inactivo"}
        </span>
      </div>
    </div>
  );
}
