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
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de secciones
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
}
