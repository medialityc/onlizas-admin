"use client";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import RHFInput from "@/components/react-hook-form/rhf-input";
import RHFSelect from "@/components/react-hook-form/rhf-select";
import { WAREHOUSE_TYPE_OPTIONS } from "../../../constants/warehouse-type";

export default function BasicInfoSection() {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4 bg-slate-100 dark:bg-slate-900">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="w-5 h-5 text-gray-500 dark:text-gray-100" />
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-none">
            Información básica
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="col-span-1 xl:col-span-2">
          <RHFInput
            name="name"
            label="Nombre del Almacén"
            placeholder="Ej: Centro de Distribución Principal"
            required
          />
        </div>
        <RHFSelect name="type" label="Tipo" options={WAREHOUSE_TYPE_OPTIONS} />
      </div>
    </section>
  );
}
