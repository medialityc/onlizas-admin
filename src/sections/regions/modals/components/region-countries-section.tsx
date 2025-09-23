"use client";
import { Region } from "@/types/regions";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import OptimizedCountryCard from "./optimized-country-card";

export default function RegionCountriesSection({ region }: { region: Region }) {
  // The modal now expects the parent to provide associated countries in region.countries
  const countries = region.countries || [];

  if (countries.length === 0) {
    return (
      <section>
        <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4 mt-6">
          <GlobeAltIcon className="size-6 text-primary" />
          Países Asociados
        </h2>
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-8 shadow-sm text-center">
          <GlobeAltIcon className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No hay países asociados a esta región
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4 mt-6">
        <GlobeAltIcon className="size-6 text-primary" />
        Países Asociados ({countries.length})
      </h2>
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {countries.map((country) => (
            <OptimizedCountryCard key={country.id} country={country as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
