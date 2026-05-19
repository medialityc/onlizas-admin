"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { ListWholesaleBuyersResult } from "@/types/wholesale-buyers";
import { WholesaleBuyersList } from "./wholesale-buyers-list";

interface Props {
  dataPromise: ApiResponse<ListWholesaleBuyersResult>;
  query: SearchParams;
}

export default function WholesaleBuyersListContainer({
  dataPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Compradores Mayoristas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los compradores mayoristas del sistema y sus
            configuraciones asociadas
          </p>
        </div>
      </div>
      <WholesaleBuyersList
        data={dataPromise.data}
        searchParams={query}
        onSearchParamsChange={updateFiltersInUrl}
      />
    </div>
  );
}
