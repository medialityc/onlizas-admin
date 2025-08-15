'use client';

import { Warehouse } from '@/types/warehouses';
import { SearchInput } from '@/components/search/search-input';
import { useState } from 'react';
import { mockInventoryData } from '@/services/warehouses-mock';

interface WarehouseInventoryProps {
  warehouse: Warehouse;
}

export function WarehouseInventory ({ warehouse }: WarehouseInventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar inventarios por búsqueda
  const filteredInventory = mockInventoryData.filter(item =>
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">      <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Inventarios del Almacén</h2>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar inventarios..."
        className="max-w-md"
      />
    </div>      <div className="space-y-4">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.productName}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>Categoría: <span className="text-blue-600 dark:text-blue-400">{item.category}</span></span>
                  <span>Proveedor: <span className="text-green-600 dark:text-green-400">{item.supplier}</span></span>
                  <span>Total: <span className="font-semibold">{item.variants.reduce((acc, v) => acc + v.available, 0)} unidades</span></span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                Actualizado: {item.lastUpdated}
              </div>
            </div>            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidades por variante:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.variants.map((variant) => (
                  <div key={variant.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">{variant.name}</h5>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {variant.storage && <span>Almacenamiento: {variant.storage}</span>}
                          {'color' in variant && variant.color && <span className="ml-3">Color: {variant.color}</span>}
                          {'processor' in variant && variant.processor && <span className="ml-3">Procesador: {variant.processor}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{variant.available}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Disponible: {variant.available}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}        {filteredInventory.length === 0 && (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {searchQuery ?
                'No se encontraron inventarios que coincidan con tu búsqueda' :
                'No hay inventarios en este almacén'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
