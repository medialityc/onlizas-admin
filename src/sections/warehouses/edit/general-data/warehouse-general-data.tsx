"use client";

import { Warehouse } from "@/types/warehouses";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import RHFInput from "@/components/react-hook-form/rhf-input";
import RHFSelect from "@/components/react-hook-form/rhf-select";
import { Button } from "@/components/button/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWarehouse } from "@/services/warehouses-mock";
import {
  defaultWarehouseFormValues,
  transformToApiFormat,
  warehouseFormSchema,
} from "../../warehouse-form/schema/warehouse-schema";

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
  const watchedType = watch("type");

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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Información General
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RHFInput
                name="name"
                label="Nombre del Almacén"
                placeholder="Ej: Centro de Distribución Principal"
                required
              />
              <RHFInput
                name="address"
                label="Dirección"
                placeholder="Ej: Av. Industrial 123, Ciudad de México"
              />
            </div>
            <div className="grid items-end grid-cols-1 md:grid-cols-3 gap-6">
              <RHFInput
                name="city"
                label="Ciudad"
                placeholder="Ej: Ciudad de México"
              />
              <RHFInput
                name="maxCapacity"
                label="Capacidad"
                type="number"
                placeholder="10000"
              />
              <RHFSelect
                name="status"
                label="Estado"
                options={[
                  { value: "active", label: "Activo" },
                  { value: "inactive", label: "Inactivo" },
                  { value: "maintenance", label: "Mantenimiento" },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RHFInput
                name="managerName"
                label="Gestor"
                placeholder="Ej: Carlos Rodríguez"
              />
              {watchedType === "virtual" && (
                <RHFSelect
                  name="supplierId"
                  label="Proveedor Asociado"
                  options={[
                    { value: 101, label: "TechSupply Corp" },
                    { value: 102, label: "ElectroMax SA" },
                    { value: 103, label: "HomeGoods Inc" },
                  ]}
                />
              )}
            </div>{" "}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Button type="button" variant="secondary" outline>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={mutation.isPending}
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
