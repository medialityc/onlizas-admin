'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getWarehouseById } from '@/services/warehouses-mock';
import { EditWarehouseTabs } from '../../../../../../sections/warehouses/edit/edit-warehouse-tabs';
import { WarehouseGeneralData } from '../../../../../../sections/warehouses/edit/warehouse-general-data';
import { WarehouseInventory } from '../../../../../../sections/warehouses/edit/warehouse-inventory';
import { WarehouseTransfers } from '../../../../../../sections/warehouses/edit/warehouse-transfers';
import Loader from '../../../../../../components/loaders/loader';

export default function EditWarehousePage () {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('general');

  const { data: resp, isLoading } = useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouseById(Number(id)),
    enabled: !!id,
  });

  const warehouse = resp?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!warehouse || resp?.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error al cargar el almacén</div>
        <p className="text-gray-500">El almacén solicitado no existe o no tienes permisos para verlo.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <WarehouseGeneralData warehouse={warehouse} />;
      case 'inventory':
        return <WarehouseInventory warehouse={warehouse} />;
      case 'transfers':
        return <WarehouseTransfers warehouse={warehouse} />;
      default:
        return <WarehouseGeneralData warehouse={warehouse} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{warehouse.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Almacén {warehouse.type === 'physical' ? 'Físico' : 'Virtual'} •
              ID: {warehouse.id} •
              Estado: {warehouse.status === 'active' ? 'Activo' : warehouse.status === 'maintenance' ? 'Mantenimiento' : 'Inactivo'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <EditWarehouseTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        warehouse={warehouse}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
