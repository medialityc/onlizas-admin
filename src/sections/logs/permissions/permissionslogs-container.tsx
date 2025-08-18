"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React, { use } from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllPermissionsLogsResponse } from "@/types/permissions";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import PermissionsLogsContent from "./permissionslogs-list";

function PermissionsLogsContainer({
  permissionsLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  permissionsLogsPromise: Promise<ApiResponse<GetAllPermissionsLogsResponse>>;
}) {
  const permissionsResponse = use(permissionsLogsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(permissionsResponse);

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
