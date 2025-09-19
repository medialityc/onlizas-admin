"use client";

import { Region } from "@/types/regions";
import { Badge } from "@mantine/core";

interface RegionCurrencySectionProps {
  region: Region;
}

export default function RegionCurrencySection({ region }: RegionCurrencySectionProps) {
  console.log("💰 RegionCurrencySection - Región recibida:", region);
  console.log("💰 RegionCurrencySection - currencyConfig:", region.currencyConfig);
  
  if (!region.currencyConfig) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-lg mb-3">Configuración de Monedas</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay información de monedas disponible</p>
      </div>
    );
  }

  const { primaryCurrency, allCurrencies, enabledCount, totalCount } = region.currencyConfig;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <h3 className="font-medium text-lg mb-3">Configuración de Monedas</h3>
      
      {/* Moneda principal */}
      {primaryCurrency ? (
        <div className="mb-4">
          <h4 className="font-medium text-base mb-2">Moneda Principal</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {primaryCurrency.name || 'Sin nombre'} ({primaryCurrency.code || 'Sin código'})
              </span>
              <Badge color={primaryCurrency.isEnabled ? "green" : "gray"}>
                {primaryCurrency.isEnabled ? "Habilitada" : "Deshabilitada"}
              </Badge>
            </div>
            <div className="text-sm">
              <p>Símbolo: {primaryCurrency.symbol || 'N/A'}</p>
              <p>Tasa: {primaryCurrency.rate || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h4 className="font-medium text-base mb-2">Moneda Principal</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay moneda principal configurada</p>
        </div>
      )}

      {/* Todas las monedas */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-base">Todas las Monedas</h4>
          <span className="text-xs text-gray-500">{enabledCount || 0} de {totalCount || 0} habilitadas</span>
        </div>
        {allCurrencies && allCurrencies.length > 0 ? (
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {allCurrencies.map((currency, index) => (
              <div 
                key={currency?.currencyId || index} 
                className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {currency?.name || 'Sin nombre'} ({currency?.code || 'Sin código'})
                  </p>
                  <p className="text-xs text-gray-500">
                    {currency?.symbol || 'N/A'} - Tasa: {currency?.rate || 'N/A'}
                  </p>
                </div>
                <Badge 
                  color={currency?.isEnabled ? "green" : "gray"} 
                  size="sm"
                >
                  {currency?.isPrimary ? "Principal" : currency?.isEnabled ? "Habilitada" : "Deshabilitada"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay monedas configuradas</p>
        )}
      </div>
    </div>
  );
}