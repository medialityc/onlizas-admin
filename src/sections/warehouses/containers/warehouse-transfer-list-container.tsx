"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllWarehouseTransfers } from "@/types/warehouses-transfers";
import { WarehouseTransferList } from "../components/warehouse-transfer-list/warehouse-transfer-list";

interface Props {
  warehousesTransferPromise: ApiResponse<GetAllWarehouseTransfers>;
  query: SearchParams;
  currentWarehouseId: string;
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
  const allTransfers = warehousesTransferPromise?.error
    ? []
    : warehousesTransferPromise?.data?.data || [];

  // Filtrar transferencias que involucren el almacén actual (como origen o destino)
  const transferData = allTransfers.filter(
    (trans) =>
      trans.originId === currentWarehouseId ||
      trans.destinationId === currentWarehouseId
  );

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
