"use client";

import { useCountry } from "@/hooks/use-country";

export default function CountryCard({ countryId }: { countryId: number }) {
  const { country, loading, flag } = useCountry(countryId);

  if (loading) {
    return (
      <div className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg animate-pulse min-h-[68px] flex items-center gap-3">
        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[68px] flex items-center">
        <div className="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0 mr-3"></div>
        <span className="text-sm text-gray-500">País no encontrado</span>
      </div>
    );
  }

  return (
    <div className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[68px] flex items-center gap-3">
      <div className="flex-shrink-0 w-12 h-8 flex items-center justify-center overflow-hidden rounded-sm">
        {flag}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {country.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {country.code}
        </div>
      </div>
    </div>
  );
}
