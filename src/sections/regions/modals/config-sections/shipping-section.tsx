'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button/button';
import { Input } from '@/components/input/input';
import Badge from '@/components/badge/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addShippingMethodsToRegion, 
  getRegionById
} from '@/services/regions';
import { RegionShippingConfig, RegionShippingMethod } from '@/types/regions';

interface ShippingSectionProps {
  regionId: number|string;
  regionName: string;
  onClose: () => void;
}

export const ShippingSection: React.FC<ShippingSectionProps> = ({
  regionId,
  regionName,
  onClose
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [baseCost, setBaseCost] = useState<string>('');
  const [estimatedDaysMin, setEstimatedDaysMin] = useState<string>('');
  const [estimatedDaysMax, setEstimatedDaysMax] = useState<string>('');
  const queryClient = useQueryClient();

  // Mock shipping methods - replace with actual API call
  const mockShippingMethods = [
    { id: 1, name: 'Envío Estándar', description: 'Entrega en 3-5 días hábiles' },
    { id: 2, name: 'Envío Express', description: 'Entrega en 1-2 días hábiles' },
    { id: 3, name: 'Envío Same Day', description: 'Entrega el mismo día' },
    { id: 4, name: 'Retiro en Tienda', description: 'Retiro gratuito en sucursal' },
    { id: 5, name: 'Envío Internacional', description: 'Entrega internacional 7-15 días' }
  ];

  // Fetch region configuration
  const { data: regionData, isLoading } = useQuery({
    queryKey: ['region-details', regionId],
    queryFn: () => getRegionById(regionId),
    enabled: !!regionId
  });

  const regionShippingMethods = regionData?.data?.shippingConfig?.methods || [];

  // Mutations
  const addShippingMutation = useMutation({
    mutationFn: (config: { shippingMethodId: number|string; baseCost?: number; estimatedDaysMin?: number; estimatedDaysMax?: number; carrier?: string }) => 
      addShippingMethodsToRegion(regionId, {
        shippingMethods: [{
          shippingMethodId: config.shippingMethodId,
          baseCost: config.baseCost || 0,
          estimatedDaysMin: config.estimatedDaysMin || 1,
          estimatedDaysMax: config.estimatedDaysMax || 5,
          carrier: config.carrier || 'Default Carrier',
          enabled: true
        }]
      }),
    onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['region-details', regionId] });
      setSelectedMethodId('');
      setBaseCost('');
      setEstimatedDaysMin('');
      setEstimatedDaysMax('');
    }
  });

  const handleAddShippingMethod = () => {
    if (selectedMethodId) {
      const config = {
        shippingMethodId: parseInt(selectedMethodId),
        baseCost: baseCost ? parseFloat(baseCost) : undefined,
        estimatedDaysMin: estimatedDaysMin ? parseInt(estimatedDaysMin) : undefined,
        estimatedDaysMax: estimatedDaysMax ? parseInt(estimatedDaysMax) : undefined,
        carrier: 'Default Carrier'
      };
      
      addShippingMutation.mutate(config);
    }
  };

  // Get available shipping methods (not already assigned)
  const assignedMethodIds = regionShippingMethods.map((rs: RegionShippingMethod) => rs.shippingMethodId);
  const availableMethods = mockShippingMethods.filter(method => 
    !assignedMethodIds.includes(method.id)
  );

  if (isLoading) {
    return <div className="p-4 text-center">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Configurar Métodos de Envío - {regionName}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Asocia métodos de envío disponibles para esta región con sus respectivos costos y tiempos estimados.
        </p>
      </div>

      {/* Add new shipping method */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Agregar Nuevo Método de Envío</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Método de Envío</label>
              <select
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={availableMethods.length === 0}
              >
                <option value="">Seleccionar método...</option>
                {availableMethods.map(method => (
                  <option key={method.id} value={method.id.toString()}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Costo Base (opcional)</label>
              <Input
                type="number"
                step="0.01"
                value={baseCost}
                onChange={(e) => setBaseCost(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Días Mínimos (opcional)</label>
              <Input
                type="number"
                value={estimatedDaysMin}
                onChange={(e) => setEstimatedDaysMin(e.target.value)}
                placeholder="1"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Días Máximos (opcional)</label>
              <Input
                type="number"
                value={estimatedDaysMax}
                onChange={(e) => setEstimatedDaysMax(e.target.value)}
                placeholder="5"
                min="0"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleAddShippingMethod}
              disabled={!selectedMethodId || addShippingMutation.isPending}
              size="sm"
            >
              {addShippingMutation.isPending ? 'Agregando...' : 'Agregar Método'}
            </Button>
          </div>
        </div>
        
        {availableMethods.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Todos los métodos de envío disponibles ya están asignados a esta región.
          </p>
        )}
      </div>

      {/* Current shipping methods */}
      <div>
        <h4 className="font-medium mb-3">Métodos de Envío Configurados</h4>
        {regionShippingMethods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay métodos de envío configurados para esta región.
          </div>
        ) : (
          <div className="space-y-2">
            {regionShippingMethods.map((regionShipping: RegionShippingMethod, index: number) => {
              const method = mockShippingMethods.find(m => m.id === regionShipping.shippingMethodId);
              if (!method) return null;

              return (
                <div
                  key={`shipping-${regionShipping.shippingMethodId}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-medium">{method.name}</span>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                    {regionShipping.isEnabled ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    {regionShipping.baseCost && (
                      <div className="text-sm">
                        <span className="font-medium">${regionShipping.baseCost}</span>
                      </div>
                    )}
                    {(regionShipping.estimatedDaysMin || regionShipping.estimatedDaysMax) && (
                      <div className="text-xs text-gray-500">
                        {regionShipping.estimatedDaysMin && regionShipping.estimatedDaysMax 
                          ? `${regionShipping.estimatedDaysMin}-${regionShipping.estimatedDaysMax} días`
                          : regionShipping.estimatedDaysMin 
                          ? `Desde ${regionShipping.estimatedDaysMin} días`
                          : `Hasta ${regionShipping.estimatedDaysMax} días`
                        }
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button outline onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};