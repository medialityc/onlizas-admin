"use client";

import { Button } from "@/components/button/button";
import { PAGE_SIZES } from "@/components/datagrid/constants";

export type PaginationProps = {
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function Pagination({
  page,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil((totalRecords || 0) / pageSize));
  const from = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalRecords || 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4">
      <div className="text-sm text-gray-600">
        {totalRecords > 0
          ? `Mostrando ${from} - ${to} de ${totalRecords}`
          : "No hay registros"}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Por página</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            outline
            variant="secondary"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-700">
            {page} / {totalPages}
          </span>
          <Button
            outline
            variant="secondary"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
