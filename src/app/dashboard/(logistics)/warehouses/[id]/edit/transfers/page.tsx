import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getWarehouseById } from '@/services/warehouses-mock';
import { EditWarehouseTabs } from '@/sections/warehouses/edit/edit-warehouse-tabs';
import { WarehouseTransfers } from '@/sections/warehouses/edit/warehouse-transfers';
import EditHeader from '@/sections/warehouses/edit/edit-header';
import Loader from '@/components/loaders/loader';

function EditWarehouseTransfersLoadingFallback () {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader />
    </div>
  );
}

async function EditWarehouseTransfersContent ({ id }: { id: string }) {
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
      <EditWarehouseTabs activeTab="transfers" warehouse={warehouse} />

      {/* Tab Content - Transferencias */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <WarehouseTransfers warehouse={warehouse} />
      </div>
    </div>
  );
}

export default async function EditWarehouseTransfersPage ({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditWarehouseTransfersLoadingFallback />}>
      <EditWarehouseTransfersContent id={id} />
    </Suspense>
  );
}
