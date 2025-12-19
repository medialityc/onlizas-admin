"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllBrandsResponse } from "@/types/brands";
import { BrandList } from "@/sections/brands/list/brand-list";

interface BrandListPageProps {
  brandsPromise: ApiResponse<GetAllBrandsResponse>;
  query: SearchParams;
}

export default function BrandListContainer({
  brandsPromise,
  query,
}: BrandListPageProps) {
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Gestión de Marcas
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra las marcas del sistema
            </p>
          </div>
        </div>
        <BrandList
          data={brandsPromise.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
