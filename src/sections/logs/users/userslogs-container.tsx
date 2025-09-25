"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllUsersLogsResponse } from "@/types/users";
import { SearchParams } from "@/types/fetch/request";

import UsersLogsContent from "./userslogs-list";

function UsersLogsContainer({
  usersLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  usersLogsPromise: ApiResponse<GetAllUsersLogsResponse>;
}) {
  const usersResponse = usersLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    usersResponse.data && (
      <UsersLogsContent
        data={usersResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default UsersLogsContainer;
