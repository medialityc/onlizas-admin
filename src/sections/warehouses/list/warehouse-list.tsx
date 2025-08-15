'use client';

import { Warehouse } from '@/types/warehouses';
import { useRouter } from 'next/navigation';
import { useModalState } from '@/hooks/use-modal-state';
import { WarehouseCreateModal } from '../modals/warehouse-create-modal';
import { WarehouseDeleteModal } from '../modals/warehouse-delete-modal';
import useFiltersUrl from '@/hooks/use-filters-url';
import { useState } from 'react';
import { warehousesTabs } from '../config/tabs';
import { NavigationTabs } from '@/components/tab/navigation-tabs';
import { WarehouseCard } from '../components/warehouse-card';
import { Button } from '@/components/button/button';
import { PlusIcon, BuildingStorefrontIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { paths } from '@/config/paths';
import { updateWarehouse } from '@/services/warehouses-mock';
import { SearchInput } from '@/components/search/search-input';

interface WarehouseListProps {
  data?: any;
  searchParams: any;
  onSearchParamsChange?: (params: any) => void;
}

export function WarehouseList ({ data, searchParams, onSearchParamsChange }: WarehouseListProps) {
  const router = useRouter();
  const { getModalState, openModal, closeModal } = useModalState();
  const { updateFiltersInUrl } = useFiltersUrl();
  const createModal = getModalState('createWarehouse');
  const deleteModal = getModalState('deleteWarehouse');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const handleCreate = () => openModal('createWarehouse');
  const handleView = (warehouse: Warehouse) => router.push(paths.dashboard.warehouses.view(warehouse.id));
  const handleEdit = (warehouse: Warehouse) => router.push(paths.dashboard.warehouses.edit(warehouse.id));

  const handleDeleteModalOpen = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    openModal('deleteWarehouse');
  };

  const handleDeleteModalClose = () => {
    setSelectedWarehouse(null);
    closeModal('deleteWarehouse');
  };

  // Filtrar datos por búsqueda
  const searchQuery = searchParams?.search || '';
  const filteredData = data?.filter((warehouse: Warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSearchChange = (search: string) => {
    const newParams = { ...searchParams, search };
    updateFiltersInUrl(newParams);
    onSearchParamsChange?.(newParams);
  }; return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Almacenes</h1>
            <p className="text-gray-600 text-sm mt-1">Administra almacenes físicos y virtuales</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" outline>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Transferencias
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Almacén
            </Button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BuildingStorefrontIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Almacenes Físicos</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Almacenes Virtuales</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacidad Total</p>
                <p className="text-2xl font-bold text-gray-900">25.000</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stock Actual</p>
                <p className="text-2xl font-bold text-gray-900">17.000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de navegación */}
        <NavigationTabs tabs={warehousesTabs} className="mb-6" />

        {/* Barra de búsqueda */}
        <div className="flex justify-between items-center">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar almacenes..."
            className="max-w-md"
          />
        </div>

        {/* Lista de almacenes en formato de cards */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((warehouse: Warehouse) => (
              <WarehouseCard
                key={warehouse.id}
                warehouse={warehouse}
                onEdit={handleEdit}
                onDelete={handleDeleteModalOpen}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchQuery ?
                'No se encontraron almacenes que coincidan con tu búsqueda' :
                'No se encontraron almacenes'
              }
            </div>
            {!searchQuery && (
              <Button variant="primary" onClick={handleCreate}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear primer almacén
              </Button>
            )}
          </div>
        )}
      </div>

      <WarehouseCreateModal open={createModal.open} onClose={() => closeModal('createWarehouse')} />
      <WarehouseDeleteModal
        open={deleteModal.open}
        onClose={handleDeleteModalClose}
        warehouse={selectedWarehouse}
      />
    </>
  );
}
