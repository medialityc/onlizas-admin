"use client";

import { Region } from "@/types/regions";
import { Badge } from "@mantine/core";

interface RegionPaymentSectionProps {
  region: Region;
}

export default function RegionPaymentSection({ region }: RegionPaymentSectionProps) {
  if (!region.paymentConfig) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="font-medium text-lg mb-3">Configuración de Pagos</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay información de pasarelas de pago disponible</p>
      </div>
    );
  }

  const { gateways, fallbackGateway, enabledCount, totalCount } = region.paymentConfig;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-lg">Configuración de Pagos</h3>
        <span className="text-xs text-gray-500">{enabledCount || 0} de {totalCount || 0} habilitados</span>
      </div>
      
      {/* Pasarela de respaldo */}
      {fallbackGateway ? (
        <div className="mb-4">
          <h4 className="font-medium text-base mb-2">Pasarela de Respaldo</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {fallbackGateway.name || 'Sin nombre'} ({fallbackGateway.code || 'Sin código'})
              </span>
              <Badge color="blue">Respaldo</Badge>
            </div>
            <div className="text-sm">
              <p>Prioridad: {fallbackGateway.priority || 'N/A'}</p>
              <p>Métodos: {fallbackGateway.supportedMethods?.join(', ') || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h4 className="font-medium text-base mb-2">Pasarela de Respaldo</h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay pasarela de respaldo configurada</p>
        </div>
      )}

      {/* Todas las pasarelas */}
      <div>
        <h4 className="font-medium text-base mb-2">Pasarelas de Pago</h4>
        {gateways && gateways.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {gateways.map((gateway, index) => (
              <div 
                key={gateway?.paymentGatewayId || index} 
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {gateway?.name || 'Sin nombre'} ({gateway?.code || 'Sin código'})
                  </span>
                  <div className="flex gap-2">
                    {gateway?.isFallback && <Badge color="blue">Respaldo</Badge>}
                    <Badge color={gateway?.isEnabled ? "green" : "gray"}>
                      {gateway?.isEnabled ? "Habilitada" : "Deshabilitada"}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm">
                  <p>Prioridad: {gateway?.priority || 'N/A'}</p>
                  <p className="text-xs text-gray-500">
                    Métodos: {gateway?.supportedMethods?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No hay pasarelas configuradas</p>
        )}
      </div>
    </div>
  );
}