"use client";

import { FormProvider } from "react-hook-form";
import RHFSelect from "@/components/react-hook-form/rhf-select";

export default function DestinationSelect({
  methods,
  options,
}: {
  methods: any;
  options: { value: string; label: string }[];
}) {
  return (
    <FormProvider {...methods}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Almacén Destino
        </h3>
        <RHFSelect
          name="destinationWarehouseId"
          label="Seleccionar Almacén de Destino"
          placeholder="Selecciona el almacén destino..."
          options={options}
        />
      </div>
    </FormProvider>
  );
}
