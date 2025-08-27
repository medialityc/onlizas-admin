"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllCurrenciesLogs } from "@/types/currencies";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import CurrenciesLogsContent from "./currencieslogs-list";

function CurrenciesLogsContainer({
  currenciesLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  currenciesLogsPromise: ApiResponse<GetAllCurrenciesLogs>;
}) {
  const currenciesResponse = currenciesLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(currenciesResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    currenciesResponse.data && (
      <CurrenciesLogsContent
        data={currenciesResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default CurrenciesLogsContainer;
