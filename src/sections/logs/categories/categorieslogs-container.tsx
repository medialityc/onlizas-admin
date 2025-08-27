"use client";
import useFiltersUrl from "@/hooks/use-filters-url";
import React from "react";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllCategoriesLogs } from "@/types/categories";
import { SearchParams } from "@/types/fetch/request";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import CategoriesLogsContent from "./categorieslogs-list";

function CategoriesLogsContainer({
  categoriesLogsPromise,
  searchParams,
}: {
  searchParams: SearchParams;
  categoriesLogsPromise: ApiResponse<GetAllCategoriesLogs>;
}) {
  const categoriesResponse = categoriesLogsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();
  useFetchError(categoriesResponse);

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };
  return (
    categoriesResponse.data && (
      <CategoriesLogsContent
        data={categoriesResponse.data}
        onSearchParamsChange={handleSearchParamsChange}
        searchParams={searchParams}
      />
    )
  );
}

export default CategoriesLogsContainer;
