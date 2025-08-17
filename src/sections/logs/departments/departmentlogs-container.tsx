"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React, { use } from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllDepartmentsLogs } from "@/types/departments";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import DepartmentLogsContent from "./departmentlogs-list";

function DepartmentLogsContainer({
  departmentLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  departmentLogsPromise: Promise<ApiResponse<GetAllDepartmentsLogs>>;
}) {
  const departmentResponse = use(departmentLogsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(departmentResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    departmentResponse.data && (
      <DepartmentLogsContent
        data={departmentResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default DepartmentLogsContainer;
