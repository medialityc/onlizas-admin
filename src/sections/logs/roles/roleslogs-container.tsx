"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllRolesLogsResponse } from "@/types/roles";
import { SearchParams } from "@/types/fetch/request";

import RolesLogsContent from "./roleslogs-list";

function RolesLogsContainer({
  rolesLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  rolesLogsPromise: ApiResponse<GetAllRolesLogsResponse>;
}) {
  const rolesResponse = rolesLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
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
