"use client";

import { useEffect, useState } from "react";

import { useDataGridHandlers } from "../datagrid/hooks";
import { DataGridCardProps } from "../datagrid/types";

import TablePagination from "./footer/table-pagination";
import { PAGE_SIZES } from "../datagrid/constants";
import { Header } from "./header/header";

export function DataGridCard<T extends Record<string, any>>({
  searchParams = {},
  onSearchParamsChange,
  searchPlaceholder,
  enableSearch = true,
  onCreate,
  className = "",
  createLoading = false,
  createText,
  rightActions,
  component,
  hidePagination = false,
  data,
}: DataGridCardProps<T>) {
  const [searchValue, setSearchValue] = useState(searchParams.search || "");

  const { handleSearch, handlePageChange, handlePageSizeChange } =
    useDataGridHandlers({
      searchParams,
      onSearchParamsChange,
    });

  // Handle search with state update
  const handleSearchWithState = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  useEffect(() => {
    setSearchValue(searchParams.search || "");
  }, [searchParams.search, searchParams.sortBy, searchParams.isDescending]);

  return (
    <div className={`${className}`}>
      <Header
        enableSearch={enableSearch}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={handleSearchWithState}
        onCreate={onCreate}
        createLoading={createLoading}
        createText={createText}
        rightActions={rightActions}
      />

      {/* list card */}
      <div className="h-auto min-h-80">{component}</div>

      {/* pagination */}
      {!hidePagination && (
        <TablePagination
          pageSizeOptions={PAGE_SIZES}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          page={searchParams.page ?? 1}
          pageSize={searchParams.pageSize ?? 10}
          total={data?.totalCount ?? 0}
        />
      )}
    </div>
  );
}
