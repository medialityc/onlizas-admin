"use client";

import { Warehouse } from "@/types/warehouses";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/button/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWarehouse } from "@/services/warehouses-mock";
import {
  defaultWarehouseFormValues,
  transformToApiFormat,
  warehouseFormSchema,
} from "../../warehouse-form/schema/warehouse-schema";
import HeaderBar from "./components/HeaderBar";
import BasicInfoSection from "./components/BasicInfoSection";
import CapacitySection from "./components/CapacitySection";
import LocationSection from "./components/LocationSection";
import ManagerSection from "./components/ManagerSection";

interface WarehouseGeneralDataProps {
  warehouse: Warehouse;
}

export function WarehouseGeneralData({ warehouse }: WarehouseGeneralDataProps) {
  const queryClient = useQueryClient();

  // Valores por defecto dinámicos basados en warehouse
  const getDefaultValues = () => {
    if (warehouse) {
      return {
        name: warehouse.name,
        type: warehouse.type,
        status: warehouse.status,
        description: warehouse.description || "",
        maxCapacity: warehouse.maxCapacity,
        currentCapacity: warehouse.currentCapacity || 0,
        managerName: warehouse.managerName || "",
        managerEmail: warehouse.managerEmail || "",
        managerPhone: warehouse.managerPhone || "",
        locationId: warehouse.location?.id || 1,
        address: warehouse.location?.address || "",
        city: "", // No disponible en el tipo actual
        state: "", // No disponible en el tipo actual
        country: warehouse.location?.country || "",
        postalCode: warehouse.location?.postalCode || "",
        coordinates: warehouse.location?.coordinates,
        virtualSubType: warehouse.virtualSubType || "general",
        virtualRules:
          warehouse.virtualRules || defaultWarehouseFormValues.virtualRules,
        linkedPhysicalWarehouseId: warehouse.linkedPhysicalWarehouseId,
        supplierId: warehouse.supplierId,
      };
    }
    return defaultWarehouseFormValues;
  };

  const methods = useForm({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const { handleSubmit, watch } = methods;
  const watchedMax = Number(watch("maxCapacity") || 0);
  const watchedCurrent = Number(watch("currentCapacity") || 0);
  const occupancy = Math.min(
    100,
    Math.max(
      0,
      watchedMax > 0 ? Math.round((watchedCurrent / watchedMax) * 100) : 0
    )
  );
  const capacityError = watchedMax > 0 && watchedCurrent > watchedMax;
  const capacityWarnZeroMax = watchedMax === 0 && watchedCurrent > 0;

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const apiData = transformToApiFormat(data);
      return updateWarehouse(warehouse.id, apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse", warehouse.id] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      // Mostrar notificación de éxito aquí
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="space-y-6">
      <div className="panel rounded-lg border border-gray-100 dark:border-gray-700 p-0">
        <FormProvider {...methods}>
          {/* Header visual */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#0d1a2b] dark:to-[#0b1624] border-b border-gray-100 dark:border-gray-700">
            <HeaderBar />
          </div>

          <form onSubmit={onSubmit} className="p-6">
            {capacityError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 p-3 flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Capacidad inválida
                  </p>
                  <p className="text-xs text-red-700/90 dark:text-red-300/90">
                    La capacidad actual no puede exceder la capacidad máxima.
                    Ajusta los valores para continuar.
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
              {/* Columna principal */}
              <div className="xl:col-span-2 space-y-8">
                <BasicInfoSection />
                <CapacitySection
                  occupancy={occupancy}
                  max={watchedMax}
                  current={watchedCurrent}
                  capacityError={capacityError}
                  capacityWarnZeroMax={capacityWarnZeroMax}
                />
                <LocationSection />
                <ManagerSection />
              </div>

              {/* Aside resumen */}
              <aside className="space-y-6 xl:pl-6 xl:border-l border-gray-100 dark:border-gray-700">
                <div className="space-y-6 xl:sticky xl:top-16">
                  {/* Tarjeta de resumen */}
                  <div className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                      Resumen
                    </h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                      <li className="flex justify-between">
                        <span>ID</span>
                        <span className="font-medium">#{warehouse.id}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Creado</span>
                        <span className="font-medium">
                          {new Date(warehouse.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Actualizado</span>
                        <span className="font-medium">
                          {new Date(warehouse.updatedAt).toLocaleDateString()}
                        </span>
                      </li>
                    </ul>

                    <div className="mt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Ocupación actual
                      </p>
                      <div
                        className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"
                        title={
                          isFinite(occupancy)
                            ? `${watchedCurrent} de ${watchedMax} (${occupancy}%)`
                            : watchedCurrent > 0
                              ? `${watchedCurrent} sin capacidad máxima definida`
                              : "Sin datos de capacidad"
                        }
                      >
                        <div
                          className={
                            "h-full rounded-full transition-all duration-300 " +
                            (occupancy < 70
                              ? "bg-emerald-500"
                              : occupancy < 90
                                ? "bg-amber-500"
                                : "bg-rose-500")
                          }
                          style={{
                            width: `${isFinite(occupancy) ? occupancy : 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        {isFinite(occupancy) ? `${occupancy}%` : "0%"}
                        {watchedMax > 0 && ` • ${watchedCurrent}/${watchedMax}`}
                      </p>
                    </div>
                  </div>

                  {/* Ayuda */}
                  <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-4">
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Consejos rápidos
                    </h5>
                    <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <li>El subtipo solo aplica para almacenes virtuales.</li>
                      <li>La capacidad actual no debe exceder la máxima.</li>
                      <li>
                        Completa la dirección para optimizar rutas logísticas.
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>
            </div>

            {/* Actions stickies */}
            <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white/80 dark:bg-gray-900/60 backdrop-blur border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
              <Button type="button" variant="secondary" outline>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={mutation.isPending || capacityError}
              >
                {mutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
