"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/button/button";
import { paths } from "@/config/paths";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelect from "@/components/react-hook-form/rhf-select";
import LoaderButton from "@/components/loaders/loader-button";

import {
  WAREHOUSE_SUBTYPE_OPTIONS,
  WAREHOUSE_TYPE_ENUM,
} from "../../constants/warehouse-type";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { defaultWarehouseFormData } from "../../constants/warehouse-initvalues";
import { useWarehouseCreateForm } from "../../hooks/use-warehouse-create-form";
import { useMemo } from "react";

interface WarehouseFormProps {
  warehouse?: WarehouseFormData;
  onSuccess?: () => void;
}

export function WarehouseForm({
  warehouse = defaultWarehouseFormData,
  onSuccess,
}: WarehouseFormProps) {
  const { push } = useRouter();
  const isEdit = useMemo(() => !!warehouse?.id, [warehouse?.id]);

  const { form, isPending, onSubmit, warehouseType } = useWarehouseCreateForm({
    onSuccess,
    warehouse,
  });

  const handleCancel = () => {
    push(paths.dashboard.warehouses.list);
  };
  return (
    <FormProvider methods={form} onSubmit={onSubmit}>
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFInputWithLabel
            name="name"
            label="Nombre *"
            placeholder="Nombre del almacén"
            required
          />
          <RHFSelect
            name="type"
            label={`Tipo *${isEdit ? " (no editable)" : ""}`}
            options={[
              { value: "physical", label: "Físico" },
              { value: "virtual", label: "Virtual" },
            ]}
            disabled={isEdit}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RHFSelect
            name="status"
            label="Estado *"
            options={[
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" },
              { value: "maintenance", label: "Mantenimiento" },
            ]}
            required
          />
          <RHFInputWithLabel
            name="locationId"
            label="ID Localización"
            type="number"
            placeholder="ID de ubicación"
          />
        </div>
        {warehouseType === WAREHOUSE_TYPE_ENUM.physical && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name="maxCapacity"
              label="Capacidad Máx."
              type="number"
              placeholder="Capacidad máxima"
              min="0"
            />
            <RHFInputWithLabel
              name="currentCapacity"
              label="Capacidad Actual"
              type="number"
              placeholder="Capacidad actual"
              min="0"
            />
          </div>
        )}
        {warehouseType === WAREHOUSE_TYPE_ENUM.virtual && (
          <div className="space-y-4">
            <RHFSelect
              name="virtualSubType"
              label="Subtipo Virtual"
              options={WAREHOUSE_SUBTYPE_OPTIONS}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="linkedPhysicalWarehouseId"
                label="Almacén Físico Vinculado"
                type="number"
                placeholder="ID del almacén físico"
              />
              <RHFInputWithLabel
                name="supplierId"
                label="ID Proveedor"
                type="number"
                placeholder="ID del proveedor"
              />
            </div>
          </div>
        )}
        {/* Información del gestor */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Información del Gestor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RHFInputWithLabel
              name="managerName"
              label="Nombre del Gestor"
              placeholder="Nombre completo"
            />
            <RHFInputWithLabel
              name="managerEmail"
              label="Email del Gestor"
              type="email"
              placeholder="email@ejemplo.com"
            />
            <RHFInputWithLabel
              name="managerPhone"
              label="Teléfono del Gestor"
              type="tel"
              placeholder="+1234567890"
            />
          </div>
        </div>
        <RHFInputWithLabel
          name="description"
          label="Descripción"
          type="textarea"
          placeholder="Descripción del almacén"
          rows={3}
        />
        <div className="flex gap-3 pt-2">
          <LoaderButton type="submit" loading={isPending}>
            {isEdit ? "Actualizar" : "Crear"} Almacén
          </LoaderButton>
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
