"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import BusinessLogsContent from "./businesslogs-list";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllBusinessLogs } from "@/types/business";
import { SearchParams } from "@/types/fetch/request";

function BusinessLogsContainer({
  businessLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  businessLogsPromise: ApiResponse<GetAllBusinessLogs>;
}) {
  const businessResponse = businessLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    businessResponse.data && (
      <BusinessLogsContent
        data={businessResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default BusinessLogsContainer;
