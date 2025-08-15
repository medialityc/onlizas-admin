"use client";
import useFiltersUrl from '@/hooks/use-filters-url';
import { ApiResponse } from '@/types/fetch/api';
import { SearchParams } from '@/types/fetch/request';
import { use } from 'react';
import { GetAllWarehouses } from '@/types/warehouses';
import { WarehouseList } from './warehouse-list';

interface WarehousesListContainerProps {
  warehousesPromise: Promise<ApiResponse<GetAllWarehouses>>;
  query: SearchParams;
}

export default function WarehousesListContainer ({ warehousesPromise, query }: WarehousesListContainerProps) {
  const warehousesResponse = use(warehousesPromise);
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <WarehouseList
      data={warehousesResponse.data?.data}
      searchParams={query}
      onSearchParamsChange={handleSearchParamsChange}
    />
  );
}
