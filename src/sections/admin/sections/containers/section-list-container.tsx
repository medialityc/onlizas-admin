"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { SectionList } from "./section-list";
import { IGetAllAdminsSection } from "@/types/section";

interface Props {
  sectionPromise: ApiResponse<IGetAllAdminsSection>;
  query: SearchParams;
}

export default function SectionListContainer({ sectionPromise, query }: Props) {
  const sectionResponse = sectionPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de secciones
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las secciones de productos
          </p>
        </div>
      </div>

      <SectionList
        data={sectionResponse.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
