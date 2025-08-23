"use client";

import { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/button/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface TablePaginationProps {
  total?: number;
  pageSizeOptions: number[];
  page: number;
  pageSize: number;

  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
}

export const calculatePaginationRange = (
  page: number,
  pageSize: number,
  total: number
) => {
  if (total === 0) {
    return {
      from: 0,
      to: 0,
    };
  }
  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return {
    from,
    to,
  };
};

export default function TablePagination({
  total = 0,
  pageSize,
  pageSizeOptions,
  page,
  handlePageChange,
  handlePageSizeChange,
}: TablePaginationProps) {
  const currentLimit = pageSize;
  const currentPage = page;

  const { from, to } = calculatePaginationRange(page - 1, pageSize, total);

  const _limit = useMemo(() => currentLimit.toString(), [currentLimit]);
  const totalPages = useMemo(
    () => Math.ceil(total / currentLimit),
    [total, currentLimit]
  );

  const handlePreviewPage = useCallback(() => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageChange]);

  const handlePageSize = useCallback(
    (value: string) => {
      const pageSize = parseInt(value, 10);
      handlePageSizeChange(pageSize);
    },
    [handlePageSizeChange]
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between space-x-6 lg:space-x-8 z-10">
      <div className="flex items-center space-x-2">
        <p>Filas por página</p>

        <Select value={_limit} onValueChange={handlePageSize}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={_limit} />
          </SelectTrigger>
          <SelectContent side="top">
            {pageSizeOptions.map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-3 lg:space-x-6">
        <div className="flex  items-center justify-center text-sm font-medium whitespace-nowrap">
          {`${from} - ${to} / ${total}`}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            className="flex h-8 w-8 p-0 bg-transparent border text-primary"
            onClick={handlePreviewPage}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">preview page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            className="flex h-8 w-8 p-0 bg-transparent  border text-primary"
            onClick={handleNextPage}
            disabled={!canGoNext}
          >
            <span className="sr-only">next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
