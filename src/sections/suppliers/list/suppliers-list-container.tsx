"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { SuppliersList } from "./suppliers-list";
import { GetAllSuppliers } from "@/types/suppliers";

interface SuppliersListPageProps {
  suppliersPromise: ApiResponse<GetAllSuppliers>;
  query: SearchParams;
}

export default function SuppliersListContainer({
  suppliersPromise,
  query,
}: SuppliersListPageProps) {
  const suppliersResponse = suppliersPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(suppliersResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {suppliersResponse.status == 401 && <SessionExpiredAlert />}
      <SuppliersList
        data={suppliersResponse.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
