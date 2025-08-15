'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getWarehouseById } from '@/services/warehouses-mock';
import { EditWarehouseTabs } from '../../../../../../sections/warehouses/edit/edit-warehouse-tabs';
import { WarehouseGeneralData } from '../../../../../../sections/warehouses/edit/warehouse-general-data';
import { WarehouseInventory } from '../../../../../../sections/warehouses/edit/warehouse-inventory';
import { WarehouseTransfers } from '../../../../../../sections/warehouses/edit/warehouse-transfers';
import EditHeader from '../../../../../../sections/warehouses/edit/edit-header';
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
        <div className="text-red-500 dark:text-red-400 mb-4">Error al cargar el almacén</div>
        <p className="text-gray-500 dark:text-gray-400">El almacén solicitado no existe o no tienes permisos para verlo.</p>
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
  }; return (
    <div className="space-y-6">
      {/* Header con información del almacén */}
      <EditHeader warehouse={warehouse} />

      {/* Tabs */}
      <EditWarehouseTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        warehouse={warehouse}
      />

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
