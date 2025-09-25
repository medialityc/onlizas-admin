"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

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
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <SuppliersList
        data={suppliersResponse.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
