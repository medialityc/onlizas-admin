"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";

import { getAllLocations } from "@/services/locations";

export default function LocationSection() {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-100" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-none">
            Ubicación
          </h4>
        </div>
      </div>
      <div className="grid grid-cols-1   gap-6">
        <RHFAutocompleteFetcherInfinity
          name="locationId"
          label="Selecciona la Dirección "
          placeholder="Dirección..."
          onFetch={getAllLocations}
          objectValueKey="id"
          objectKeyLabel="name"
          queryKey="location"
        />
      </div>
    </section>
  );
}
