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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Categorías
          </h1>
          <p className="text-muted-foreground mt-1">
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
  );
}
