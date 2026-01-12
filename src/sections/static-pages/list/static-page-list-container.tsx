"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllStaticPagesResponse } from "@/types/static-pages";
import { StaticPageList } from "@/sections/static-pages/list/static-page-list";

interface StaticPageListPageProps {
  pagesPromise: ApiResponse<GetAllStaticPagesResponse>;
  query: SearchParams;
}

export default function StaticPageListContainer({
  pagesPromise,
  query,
}: StaticPageListPageProps) {
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Páginas Estáticas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las páginas de contenido estático
          </p>
        </div>
      </div>
      <StaticPageList
        data={pagesPromise.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
