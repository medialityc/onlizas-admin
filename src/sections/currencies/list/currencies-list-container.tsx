"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { GetAllCurrencies } from "@/services/currencies";
import { CurrenciesList } from "./currencies-list";

interface CurrenciesListPageProps {
  currenciesPromise: ApiResponse<GetAllCurrencies>;
  query: SearchParams;
}

export default function CurrenciesListContainer({
  currenciesPromise,
  query,
}: CurrenciesListPageProps) {
  const currenciesResponse = currenciesPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Monedas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las monedas del sistema y sus tasas de cambio
          </p>
        </div>
      </div>
      <CurrenciesList
        data={currenciesResponse.data}
        searchParams={query}
        onSearchParamsChange={handleSearchParamsChange}
      />
    </div>
  );
}
