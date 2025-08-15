import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getWarehouseById } from '@/services/warehouses-mock';
import { EditWarehouseTabs } from '@/sections/warehouses/edit/edit-warehouse-tabs';
import { WarehouseInventory } from '@/sections/warehouses/edit/warehouse-inventory';
import EditHeader from '@/sections/warehouses/edit/edit-header';
import Loader from '@/components/loaders/loader';

function EditWarehouseInventoryLoadingFallback () {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}

async function EditWarehouseInventoryContent ({ id }: { id: string }) {
  const response = await getWarehouseById(Number(id));

  if (!response?.data) {
    notFound();
  }

  const warehouse = response.data;

  return (
    <div className="space-y-6">
      {/* Header con información del almacén */}
      <EditHeader warehouse={warehouse} />

      {/* Tabs */}
      <EditWarehouseTabs activeTab="inventory" warehouse={warehouse} />

      {/* Tab Content - Inventarios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <WarehouseInventory warehouse={warehouse} />
      </div>
    </div>
  );
}

export default async function EditWarehouseInventoryPage ({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditWarehouseInventoryLoadingFallback />}>
      <EditWarehouseInventoryContent id={id} />
    </Suspense>
  );
}
