"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllWarehouses } from "@/types/warehouses";
import { InventoryCardGrid } from "../components/warehouse-card-grid/warehouse-card-grid";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";
import MeWarehouseHeader from "../components/warehouse-header/me-warehouse-header";

interface Props {
  warehousesPromise: ApiResponse<GetAllWarehouses>;
  query: SearchParams;
  baseRoute?: string;
}

export default function MeWarehouseListContainer({
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
        <MeWarehouseHeader data={warehousesPromise.data?.data as any} />

        <InventoryCardGrid
          data={warehousesPromise.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          forceType={WAREHOUSE_TYPE_ENUM.virtual}
        />
      </div>
    </div>
  );
}
