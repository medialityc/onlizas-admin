"use client";

import Image from "next/image";

interface OptimizedCountryCardProps {
  country: {
    id: number;
    code: string;
    name: string;
    phoneNumberCode: number;
  };
}

export default function OptimizedCountryCard({
  country,
}: OptimizedCountryCardProps) {
  // Usar banderas locales del proyecto en lugar de servicio externo
  const flagUrl = `/assets/images/flags/${country.code.toUpperCase()}.svg`;

  return (
    <div className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[68px] flex items-center gap-3">
      <div className="flex-shrink-0 w-12 h-8 flex items-center justify-center overflow-hidden rounded-sm">
        <ProgressiveImage
          src={flagUrl}
          alt={`Bandera de ${country.name}`}
          className="w-full h-full object-cover"
          width={48}
          height={32}
          onError={(e) => {
            // Si falla la carga de la bandera, mostrar un placeholder
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
        {/* Placeholder si falla la bandera */}
        <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
          {country.code}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {country.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <span>{country.code}</span>
          {country.phoneNumberCode && (
            <>
              <span>•</span>
              <span>+{country.phoneNumberCode}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
