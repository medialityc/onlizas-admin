"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllPermissionsLogsResponse } from "@/types/permissions";
import { SearchParams } from "@/types/fetch/request";

import PermissionsLogsContent from "./permissionslogs-list";

function PermissionsLogsContainer({
  permissionsLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  permissionsLogsPromise: ApiResponse<GetAllPermissionsLogsResponse>;
}) {
  const permissionsResponse = permissionsLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    permissionsResponse.data && (
      <PermissionsLogsContent
        data={permissionsResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default PermissionsLogsContainer;
