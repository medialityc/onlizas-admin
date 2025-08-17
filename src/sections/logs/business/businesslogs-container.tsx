"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React, { use } from "react";
import BusinessLogsContent from "./businesslogs-list";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllBusinessLogs } from "@/types/business";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";

function BusinessLogsContainer({
  businessLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  businessLogsPromise: Promise<ApiResponse<GetAllBusinessLogs>>;
}) {
  const businessResponse = use(businessLogsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(businessResponse);

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
