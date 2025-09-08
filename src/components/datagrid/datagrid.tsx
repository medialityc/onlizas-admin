"use client";

import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import { DataGridProps } from "./types";
import { PAGE_SIZES } from "./constants";
import { useColumnVisibility, useDataGridHandlers } from "./hooks";
import { DataGridHeader } from "./datagrid-header";

export function DataGrid<T extends Record<string, any>>({
  data,
  simpleData,
  columns,
  searchParams = {},
  onSearchParamsChange,
  onRowClick,
  searchPlaceholder,
  enableSearch = true,
  enablePagination = true,
  enableSorting = true,
  enableColumnToggle = true,
  minHeight = 400,
  onCreate,
  className = "",
  emptyText,
  createLoading = false,
  createText,
  leftActions,
  rightActions,
  customActions,
}: DataGridProps<T>) {
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: searchParams.sortBy || "",
    direction: searchParams.isDescending ? "desc" : "asc",
  });
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Custom hooks
  const { hiddenColumns, toggleColumnVisibility } = useColumnVisibility();
  const {
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortStatusChange,
  } = useDataGridHandlers({ searchParams, onSearchParamsChange });

  // Get visible columns (filter out hidden ones)
  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.includes(column.accessor as string)
  );

  // Handle search with state update
  const handleSearchWithState = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  // Handle sorting with state update
  const handleSortWithState = (sortStatus: DataTableSortStatus<T>) => {
    setSortStatus(sortStatus);
    handleSortStatusChange({
      columnAccessor: sortStatus.columnAccessor as string,
      direction: sortStatus.direction,
    });
  };

  // Update local state when search params change externally
  useEffect(() => {
    setSearchValue(searchParams.search || "");
    setSortStatus({
      columnAccessor: searchParams.sortBy || "",
      direction: searchParams.isDescending ? "desc" : "asc",
    });
  }, [searchParams.search, searchParams.sortBy, searchParams.isDescending]);

  return (
    <div className={`${className}`}>
      <DataGridHeader
        enableSearch={enableSearch}
        enableColumnToggle={enableColumnToggle}
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={handleSearchWithState}
        onCreate={onCreate}
        createLoading={createLoading}
        createText={createText}
        columns={columns}
        hiddenColumns={hiddenColumns}
        onToggleColumn={toggleColumnVisibility}
        showColumnSelector={showColumnSelector}
        onToggleColumnSelector={() =>
          setShowColumnSelector(!showColumnSelector)
        }
        leftActions={leftActions}
        rightActions={rightActions}
        customActions={customActions}
      />

      {/* Data Table */}
      <div className="datatables">
        <DataTable<T>
          withTableBorder={false}
          columns={visibleColumns}
          records={data?.data || simpleData || []}
          // Agregar el loading
          // fetching={loading}

          minHeight={minHeight}
          sortStatus={
            enableSorting ? sortStatus : ({} as DataTableSortStatus<T>)
          }
          onSortStatusChange={() => enableSorting && handleSortWithState}
          pinLastColumn
          className="table-hover whitespace-nowrap"
          totalRecords={data?.totalCount || simpleData?.length || 0}
          recordsPerPage={searchParams.pageSize || 10}
          page={searchParams.page || 1}
          onPageChange={enablePagination ? handlePageChange : () => {}}
          recordsPerPageOptions={enablePagination ? PAGE_SIZES : []}
          onRecordsPerPageChange={
            enablePagination ? handlePageSizeChange : () => {}
          }
          paginationText={({ from, to, totalRecords }) =>
            `Mostrando ${from} - ${to} ${"de"} ${totalRecords}`
          }
          noRecordsText={emptyText || "No hay registros"}
          loadingText={"Cargando"}
          striped
          highlightOnHover
          onRowClick={(record: any) => {
            if (onRowClick) onRowClick(record as T);
          }}
          rowClassName={onRowClick ? "cursor-pointer" : undefined}
        />
      </div>
    </div>
  );
}
