"use client";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import RHFInput from "@/components/react-hook-form/rhf-input";
import RHFSelect from "@/components/react-hook-form/rhf-select";
import { useFormContext } from "react-hook-form";

export default function BasicInfoSection() {
  const { watch } = useFormContext();
  const watchedType = watch("type");

  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Información básica
          </h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Nombre, tipo y estado del almacén.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <RHFInput
          name="name"
          label="Nombre del Almacén"
          placeholder="Ej: Centro de Distribución Principal"
          required
        />
        <RHFSelect
          name="type"
          label="Tipo"
          options={[
            { value: "physical", label: "Físico" },
            { value: "virtual", label: "Virtual" },
          ]}
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

      {watchedType === "virtual" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <RHFSelect
            name="supplierId"
            label="Proveedor Asociado"
            placeholder="Seleccionar proveedor"
            options={[
              { value: 101, label: "TechSupply Corp" },
              { value: 102, label: "ElectroMax SA" },
              { value: 103, label: "HomeGoods Inc" },
            ]}
          />
          <RHFSelect
            name="virtualSubType"
            label="Subtipo Virtual"
            placeholder="Seleccionar subtipo"
            options={[
              { value: "general", label: "General" },
              { value: "in_transit", label: "En tránsito" },
              { value: "inspection", label: "Inspección" },
              { value: "repair", label: "Reparación" },
              { value: "customer_reserved", label: "Reservado cliente" },
              { value: "damaged_goods", label: "Mercancía dañada" },
              { value: "quarantine", label: "Cuarentena" },
              { value: "staging", label: "Preparación" },
              { value: "returns", label: "Devoluciones" },
              { value: "supplier_managed", label: "Gestionado por proveedor" },
            ]}
          />
        </div>
      )}
    </section>
  );
}
