import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

const WarehouseSummary = () => {
  const { getValues, watch } = useFormContext();

  const warehouse = useMemo(
    () => getValues() as WarehouseFormData,
    [getValues]
  );

  return (
    <aside className="space-y-6 xl:pl-6 xl:border-l border-gray-100 dark:border-gray-700">
      <div className="space-y-6 xl:sticky xl:top-16">
        {/* Tarjeta de resumen */}
        <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Resumen
          </h5>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li className="flex justify-between">
              <span>Nombre</span>
              <span className="font-medium">{watch("name")}</span>
            </li>
            <li className="flex justify-between">
              <span>Creado</span>
              <span className="font-medium">
                {new Date(warehouse.createdAt!).toLocaleDateString()}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Actualizado</span>
              <span className="font-medium">
                {new Date(warehouse.updatedAt!).toLocaleDateString()}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Ocupación actual</span>
              <span className="font-medium">
                {watch("capacity")} ({watch("capacityUnit")})
              </span>
            </li>
          </ul>
        </div>

        {/* Ayuda */}
        <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4">
          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Consejos rápidos
          </h5>
          <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <li>El subtipo solo aplica para almacenes virtuales.</li>
            <li>Debe seleccionar una unidad de medida para la capacidad</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default WarehouseSummary;
