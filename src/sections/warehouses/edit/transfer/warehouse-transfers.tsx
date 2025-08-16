'use client';

import { Warehouse } from '@/types/warehouses';
import { Button } from '@/components/button/button';
import { useState } from 'react';
import { mockTransferData } from '@/services/warehouses-mock';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { getAllWarehouses } from '@/services/warehouses-mock';
import { useForm, FormProvider } from 'react-hook-form';
import RHFSelect from '@/components/react-hook-form/rhf-select';

interface WarehouseTransfersProps {
  warehouse: Warehouse;
}

export function WarehouseTransfers ({ warehouse }: WarehouseTransfersProps) {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<number, number>>({});

  // Form para el selector de almacén
  const methods = useForm({
    defaultValues: {
      destinationWarehouseId: '',
    },
  });

  const { handleSubmit, watch } = methods;
  const watchedDestinationId = watch('destinationWarehouseId');

  // Obtener lista de almacenes disponibles
  const { data: warehousesResponse } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => getAllWarehouses({}),
  });

  // Filtrar almacenes disponibles (excluir el actual) y crear opciones para el select
  const availableWarehouses = warehousesResponse?.data?.data?.filter(w => w.id !== warehouse.id) || [];
  const warehouseOptions = availableWarehouses.map(w => ({
    value: w.id.toString(),
    label: `${w.name} - ${w.type === 'physical' ? 'Físico' : 'Virtual'}`,
  }));

  const handleQuantityChange = (variantId: number, delta: number) => {
    setSelectedQuantities(prev => {
      const current = prev[variantId] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [variantId]: newValue };
    });
  }; const handleTransfer = () => {
    if (!watchedDestinationId) {
      alert('Por favor selecciona un almacén destino');
      return;
    }

    const totalItems = Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
      alert('Por favor selecciona al menos un producto para transferir');
      return;
    }

    // Aquí se implementaría la lógica de transferencia
    console.log('Transferir:', selectedQuantities, 'a almacén:', watchedDestinationId);
  };

  const onSubmit = handleSubmit((data) => {
    handleTransfer();
  }); return (
    <div className="space-y-6">      <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transferencias de Inventario</h2>
      <Button
        variant="primary"
        onClick={handleTransfer}
        disabled={!watchedDestinationId || Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0) === 0}
      >
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Nueva Transferencia
      </Button>
    </div>

      <FormProvider {...methods}>        {/* Selección de almacén destino */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Almacén Destino</h3>

          <RHFSelect
            name="destinationWarehouseId"
            label="Seleccionar Almacén de Destino"
            placeholder="Selecciona el almacén destino..."
            options={warehouseOptions}
          />
        </div>

        {/* Seleccionar inventarios para transferir */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seleccionar Inventarios para Transferir</h3>          <div className="space-y-6">
            {mockTransferData.map((item) => (
              <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.productName}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category} - {item.supplier}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidades por variante:</h5>

                  {item.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div>
                        <h6 className="font-medium text-gray-900 dark:text-white">{variant.name}</h6>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {variant.storage && <span>Almacenamiento: {variant.storage}</span>}
                          {variant.color && <span className="ml-3">Color: {variant.color}</span>}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Disponible: {variant.available}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(variant.id, -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"
                          disabled={!selectedQuantities[variant.id]}
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>

                        <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                          {selectedQuantities[variant.id] || 0}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(variant.id, 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600"
                          disabled={selectedQuantities[variant.id] >= variant.available}
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>          {/* Resumen de transferencia */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Total a transferir:</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {Object.values(selectedQuantities).reduce((sum, qty) => sum + qty, 0)} unidades
              </span>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}