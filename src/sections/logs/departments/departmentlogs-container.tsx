"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllDepartmentsLogs } from "@/types/departments";
import { SearchParams } from "@/types/fetch/request";

import DepartmentLogsContent from "./departmentlogs-list";

function DepartmentLogsContainer({
  departmentLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  departmentLogsPromise: ApiResponse<GetAllDepartmentsLogs>;
}) {
  const departmentResponse = departmentLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
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
