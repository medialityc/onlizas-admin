"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllWarehouseTransfers } from "@/types/warehouses-transfers";
import { WarehouseTransferList } from "../components/warehouse-trasfer-list/warehouse-trasfer-list";

interface Props {
  warehousesTransferPromise: ApiResponse<GetAllWarehouseTransfers>;
  query: SearchParams;
  currentWarehouseId: number;
}

export default function WarehouseTransferListContainer({
  warehousesTransferPromise,
  query,
  currentWarehouseId,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  // Extraer el array de transfers de la respuesta paginada
  const transferData = warehousesTransferPromise?.error
    ? [] // Si hay error, mostrar array vacío
    : warehousesTransferPromise?.data?.data || []; // Acceder a data.data

  return (
    <div className="space-y-6">
      <WarehouseTransferList
        data={transferData}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
        currentWarehouseId={currentWarehouseId}
      />
    </div>
  );
}
