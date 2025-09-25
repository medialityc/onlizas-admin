"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllWarehouses } from "@/types/warehouses";
import { InventoryCardGrid } from "../components/warehouse-card-grid/warehouse-card-grid";

import WarehouseHeader from "../components/warehouse-header/warehouse-header";
import WarehouseMetric from "../components/warehouse-metric/warehouse-metric";
import { NavigationTabs } from "@/components/tab/navigation-tabs";
import { warehousesTabs } from "../config/tabs";

interface Props {
  warehousesPromise: ApiResponse<GetAllWarehouses>;
  query: SearchParams;
}

export default function WarehouseListContainer({
  warehousesPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4">
        {/* header */}
        <WarehouseHeader />

        {/* metric */}
        <WarehouseMetric />

        {/* Pestañas de navegación */}
        <NavigationTabs tabs={warehousesTabs} />

        <InventoryCardGrid
          data={warehousesPromise.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
