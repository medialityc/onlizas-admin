import { buildQueryParams } from '@/lib/request';
import { Suspense } from 'react';
import { getAllWarehouses } from '@/services/warehouses';
import WarehousesListContainer from '@/sections/warehouses/list/warehouses-list-container';

function WarehousesListFallback () {
  return (
    <div className='space-y-4 animate-pulse'>
      <div className='h-8 bg-gray-200 rounded w-1/4' />
      <div className='h-6 bg-gray-200 rounded w-full' />
      <div className='h-6 bg-gray-200 rounded w-5/6' />
      <div className='h-6 bg-gray-200 rounded w-2/3' />
    </div>
  );
}

export default async function WarehousesPage ({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
  const params = await searchParams;
  const query = buildQueryParams(params);
  const warehousesPromise = getAllWarehouses(query as any);

  return (
    <Suspense fallback={<WarehousesListFallback />}>
      <WarehousesListContainer
        warehousesPromise={warehousesPromise}
        query={params}
      />
    </Suspense>
  );
}
