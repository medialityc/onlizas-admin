"use client";

import { ChartBarIcon } from "@heroicons/react/24/outline";
import RHFInput from "@/components/react-hook-form/rhf-input";
import { RHFSelect } from "@/components/react-hook-form";

export default function CapacitySection() {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Capacidad
          </h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Define la capacidad máxima y la ocupación actual.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <RHFInput
          name="capacity"
          label="Capacidad"
          type="number"
          placeholder="Ej: 10000"
          underLabel="Unidades totales que puede almacenar"
        />

        <RHFSelect
          name="capacityUnit"
          label="Tipo de unidad"
          placeholder="Seleccionar el tipo"
          options={[
            { value: "KG", label: "Kilogramos (Kg)" },
            { value: "T", label: "Toneladas" },
            { value: "U", label: "Unidad" },
          ]}
        />
      </div>
    </section>
  );
}
