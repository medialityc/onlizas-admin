"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllWarehouseTransfers } from "@/types/warehouses-transfers";
import { WarehouseTransferList } from "../components/warehouse-trasfer-list/warehouse-trasfer-list";

interface Props {
  warehousesTransferPromise: ApiResponse<GetAllWarehouseTransfers>;

  query: SearchParams;
}

export default function WarehouseTransferListContainer({
  warehousesTransferPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <WarehouseTransferList
        data={warehousesTransferPromise.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
