"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";

import { ApiResponse } from "@/types/fetch/api";
import { GetAllRegionLogs } from "@/types/regions";
import { SearchParams } from "@/types/fetch/request";

import RegionsLogsContent from "./regionslogs-list";

function RegionsLogsContainer({
  regionsLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  regionsLogsPromise: ApiResponse<GetAllRegionLogs>;
}) {
  const regionsResponse = regionsLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    regionsResponse.data && (
      <RegionsLogsContent
        data={regionsResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default RegionsLogsContainer;
