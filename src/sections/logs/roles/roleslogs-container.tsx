"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React, { use } from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllRolesLogsResponse } from "@/types/roles";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import RolesLogsContent from "./roleslogs-list";

function RolesLogsContainer({
  rolesLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  rolesLogsPromise: Promise<ApiResponse<GetAllRolesLogsResponse>>;
}) {
  const rolesResponse = use(rolesLogsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(rolesResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    rolesResponse.data && (
      <RolesLogsContent
        data={rolesResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default RolesLogsContainer;
