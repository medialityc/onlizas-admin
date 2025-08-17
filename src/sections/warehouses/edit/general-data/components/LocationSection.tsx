"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import RHFInput from "@/components/react-hook-form/rhf-input";

export default function LocationSection() {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Ubicación
          </h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Dirección completa para identificar el almacén.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RHFInput
          name="address"
          label="Dirección"
          placeholder="Ej: Av. Industrial 123, Col. Centro"
        />
        <RHFInput
          name="city"
          label="Ciudad"
          placeholder="Ej: Ciudad de México"
        />
        <RHFInput name="state" label="Estado / Región" placeholder="Ej: CDMX" />
        <RHFInput name="country" label="País" placeholder="Ej: México" />
        <RHFInput
          name="postalCode"
          label="Código Postal"
          placeholder="Ej: 01000"
        />
      </div>
    </section>
  );
}
