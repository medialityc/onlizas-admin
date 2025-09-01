"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
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
  useFetchError(warehousesTransferPromise);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {warehousesTransferPromise.status == 401 && <SessionExpiredAlert />}
      <WarehouseTransferList
        data={warehousesTransferPromise.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
