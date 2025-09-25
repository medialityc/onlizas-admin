"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllCategories } from "@/types/categories";

import { CategoriesList } from "./categories-list";

interface CategoriesListPageProps {
  categoriesPromise: ApiResponse<GetAllCategories>;
  query: SearchParams;
}

export default function CategoriesListContainer({
  categoriesPromise,
  query,
}: CategoriesListPageProps) {
  const categoriesResponse = categoriesPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Categorías
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra las categorías del sistema y sus datos asociados
            </p>
          </div>
        </div>

        <CategoriesList
          data={categoriesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
