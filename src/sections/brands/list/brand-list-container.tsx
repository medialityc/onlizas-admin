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
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Marcas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
