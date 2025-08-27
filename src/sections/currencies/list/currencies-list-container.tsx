"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
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
  useFetchError(currenciesResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      {currenciesResponse.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Monedas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
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
    </div>
  );
}
