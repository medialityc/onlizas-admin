"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllWarehouses } from "@/types/warehouses";
import { WarehouseList } from "./warehouse-list";

interface WarehousesListContainerProps {
  warehousesPromise: ApiResponse<GetAllWarehouses>;
  query: SearchParams;
}

export default function WarehousesListContainer({
  warehousesPromise,
  query,
}: WarehousesListContainerProps) {
  const warehousesResponse = warehousesPromise;
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
