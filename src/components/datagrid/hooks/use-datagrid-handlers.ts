import { useCallback } from "react";
import { SearchParams } from "@/types/fetch/request";

interface UseDataGridHandlersProps {
  searchParams: SearchParams;
  onSearchParamsChange?: (params: SearchParams) => void;
}

export function useDataGridHandlers({
  searchParams,
  onSearchParamsChange,
}: UseDataGridHandlersProps) {
  // Handle search with debouncing
  const handleSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        onSearchParamsChange?.({
          ...searchParams,
          search: value,
          page: 1, // Reset to first page on search
        });
      }, 300);

      return () => clearTimeout(timer);
    },
    [searchParams, onSearchParamsChange]
  );

  // Handle pagination
  const handlePageChange = useCallback(
    (page: number) => {
      onSearchParamsChange?.({
        ...searchParams,
        page,
      });
    },
    [searchParams, onSearchParamsChange]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      onSearchParamsChange?.({
        ...searchParams,
        pageSize,
        page: 1, // Reset to first page
      });
    },
    [searchParams, onSearchParamsChange]
  );

  // Handle sorting
  const handleSortStatusChange = useCallback(
    (sortStatus: { columnAccessor: string; direction: "asc" | "desc" }) => {
      onSearchParamsChange?.({
        ...searchParams,
        sortBy: sortStatus.columnAccessor,
        isDescending: sortStatus.direction === "desc",
        page: 1, // Reset to first page
      });
    },
    [searchParams, onSearchParamsChange]
  );

  return {
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSortStatusChange,
  };
}
