'use client';

import React, { useState } from 'react';
import { Button } from '@/components/button/button';
import { Input } from '@/components/input/input';
import Badge from '@/components/badge/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  addPaymentGatewaysToRegion, 
  removePaymentGatewayFromRegion, 
  updatePaymentGatewayPriority,
  getRegionById
} from '@/services/regions';
import { RegionPaymentGateway } from '@/types/regions';

interface PaymentsSectionProps {
  regionId: number|string;
  regionName: string;
  onClose: () => void;
}

export const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  regionId,
  regionName,
  onClose
}) => {
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('');
  const [editingPriority, setEditingPriority] = useState<{ id: number|string; priority: number } | null>(null);
  const queryClient = useQueryClient();

  // Mock payment gateways - replace with actual API call
  const mockPaymentGateways = [
    { id: 1, name: 'PayPal', code: 'paypal' },
    { id: 2, name: 'Stripe', code: 'stripe' },
  ];

  // Fetch region configuration
  const { data: regionData, isLoading } = useQuery({
    queryKey: ['region-details', regionId],
    queryFn: () => getRegionById(regionId),
    enabled: !!regionId
  });

  const regionPayments = regionData?.data?.paymentConfig?.gateways || [];

  // Mutations
  const addPaymentMutation = useMutation({
    mutationFn: ({ gatewayId }: { gatewayId: number|string }) => 
      addPaymentGatewaysToRegion(regionId, { 
        paymentGateways: [{
          paymentGatewayId: gatewayId,
          priority: 1,
          isFallback: false,
          isEnabled: true,
          supportedMethods: ['card']
        }]
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['region-details', regionId] });
      setSelectedGatewayId('');
    }
  });

  const removePaymentMutation = useMutation({
    mutationFn: (gatewayId: number|string) => removePaymentGatewayFromRegion(regionId, gatewayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['region-details', regionId] });
    }
  });

  const updatePriorityMutation = useMutation({
    mutationFn: ({ gatewayId, priority }: { gatewayId: number|string; priority: number }) => 
      updatePaymentGatewayPriority(regionId, gatewayId, { paymentGatewayId: gatewayId, newPriority: priority }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['region-details', regionId] });
      setEditingPriority(null);
    }
  });

  const handleAddPayment = () => {
    if (selectedGatewayId) {
      addPaymentMutation.mutate({
        gatewayId: parseInt(selectedGatewayId)
      });
    }
  };

  const handleRemovePayment = (gatewayId: number|string) => {
    removePaymentMutation.mutate(gatewayId);
  };

  const handleUpdatePriority = () => {
    if (editingPriority) {
      updatePriorityMutation.mutate({
        gatewayId: editingPriority.id,
        priority: editingPriority.priority
      });
    }
  };

  // Get available payment gateways (not already assigned)
  const assignedGatewayIds = regionPayments.map((rp: RegionPaymentGateway) => rp.paymentGatewayId);
  const availableGateways = mockPaymentGateways.filter(gateway => 
    !assignedGatewayIds.includes(gateway.id)
  );

  // Sort payments by priority
  const sortedPayments = [...regionPayments].sort((a: RegionPaymentGateway, b: RegionPaymentGateway) => 
    (a.priority || 0) - (b.priority || 0)
  );

  if (isLoading) {
    return <div className="p-4 text-center">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Configurar Métodos de Pago - {regionName}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Asocia métodos de pago disponibles para esta región. El orden determina la prioridad de aparición.
        </p>
      </div>

      {/* Add new payment gateway */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Agregar Nuevo Método de Pago</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <select
              value={selectedGatewayId}
              onChange={(e) => setSelectedGatewayId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={availableGateways.length === 0}
            >
              <option value="">Seleccionar método de pago...</option>
              {availableGateways.map(gateway => (
                <option key={gateway.id} value={gateway.id.toString()}>
                  {gateway.name} ({gateway.code})
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleAddPayment}
            disabled={!selectedGatewayId || addPaymentMutation.isPending}
            size="sm"
          >
            {addPaymentMutation.isPending ? 'Agregando...' : 'Agregar'}
          </Button>
        </div>
        {availableGateways.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Todos los métodos de pago disponibles ya están asignados a esta región.
          </p>
        )}
      </div>

      {/* Current payment methods */}
      <div>
        <h4 className="font-medium mb-3">Métodos de Pago Configurados</h4>
        {sortedPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay métodos de pago configurados para esta región.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPayments.map((regionPayment: RegionPaymentGateway, index) => {
              const gateway = mockPaymentGateways.find(g => g.id === regionPayment.paymentGatewayId);
              if (!gateway) return null;

              const isEditing = editingPriority?.id === regionPayment.paymentGatewayId;

              return (
                <div
                  key={`payment-${regionPayment.paymentGatewayId}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        #{regionPayment.priority || 0}
                      </span>
                      <span className="font-medium">{gateway.name}</span>
                      <span className="text-gray-600">({gateway.code})</span>
                    </div>
                    <Badge variant="success">Activo</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editingPriority?.priority || 1}
                          onChange={(e) => editingPriority && setEditingPriority({
                            ...editingPriority,
                            priority: parseInt(e.target.value) || 1
                          })}
                          className="w-20"
                          min="1"
                        />
                        <Button
                          size="sm"
                          onClick={handleUpdatePriority}
                          disabled={updatePriorityMutation.isPending}
                        >
                          Guardar
                        </Button>
                        <Button
                          outline
                          size="sm"
                          onClick={() => setEditingPriority(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          outline
                          size="sm"
                          onClick={() => setEditingPriority({
                            id: regionPayment.paymentGatewayId,
                            priority: regionPayment.priority || 1
                          })}
                        >
                          Editar Prioridad
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemovePayment(regionPayment.paymentGatewayId)}
                          disabled={removePaymentMutation.isPending}
                        >
                          Eliminar
                        </Button>
                      </>
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