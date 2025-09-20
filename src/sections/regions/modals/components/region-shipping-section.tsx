"use client";

import { Region } from "@/types/regions";
import { Badge } from "@mantine/core";

interface RegionShippingSectionProps {
  region: Region;
}

export default function RegionShippingSection({ region }: RegionShippingSectionProps) {
  if (!region.shippingConfig) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-lg mb-3">Configuración de Envíos</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay información de métodos de envío disponible</p>
      </div>
    );
  }

  const { methods, enabledCount, totalCount, minBaseCost, maxBaseCost } = region.shippingConfig;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-lg">Configuración de Envíos</h3>
        <span className="text-xs text-gray-500">{enabledCount || 0} de {totalCount || 0} habilitados</span>
      </div>
      
      {/* Resumen de costos */}
      {(minBaseCost !== undefined && minBaseCost !== null && maxBaseCost !== undefined && maxBaseCost !== null) ? (
        <div className="mb-4">
          <h4 className="font-medium text-base mb-2">Rango de Costos Base</h4>
          <div className="flex gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex-1">
              <span className="text-xs text-gray-500">Costo Mínimo</span>
              <p className="text-lg font-medium">${minBaseCost.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex-1">
              <span className="text-xs text-gray-500">Costo Máximo</span>
              <p className="text-lg font-medium">${maxBaseCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h4 className="font-medium text-base mb-2">Rango de Costos Base</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay información de costos disponible</p>
        </div>
      )}

      {/* Métodos de envío */}
      <div>
        <h4 className="font-medium text-base mb-2">Métodos de Envío</h4>
        {methods && methods.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {methods.map((method, index) => (
              <div 
                key={method?.shippingMethodId || index} 
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {method?.name || 'Sin nombre'} ({method?.code || 'Sin código'})
                  </span>
                  <Badge color={method?.isEnabled ? "green" : "gray"}>
                    {method?.isEnabled ? "Habilitado" : "Deshabilitado"}
                  </Badge>
                </div>
                <div className="text-sm">
                  <p>Transportista: {method?.carrier || 'N/A'}</p>
                  <p>Costo Base: ${method?.baseCost?.toFixed(2) || 'N/A'}</p>
                  <p className="text-xs text-gray-500">
                    Tiempo estimado: {method?.estimatedDaysMin || 'N/A'}-{method?.estimatedDaysMax || 'N/A'} días
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay métodos de envío configurados</p>
        )}
      </div>
    </div>
  );
}