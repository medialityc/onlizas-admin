import { DataTableColumn } from "mantine-datatable";
import { PaginatedResponse } from "@/types/common";
import { SearchParams } from "@/types/fetch/request";
import { ReactNode } from "react";

export interface DataGridProps<T> {
  data?: PaginatedResponse<T>;
  simpleData?: T[]; // For simple data without pagination
  columns: DataTableColumn<T>[];
  searchParams?: SearchParams;
  onSearchParamsChange?: (params: SearchParams) => void;
  onRowClick?: (record: T) => void;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableColumnToggle?: boolean; // New prop for column visibility toggle
  minHeight?: number;
  className?: string;
  emptyText?: string;
  onCreate?: () => void;
  createLoading?: boolean; // Optional prop for create button loading state
  createText?: string; // Optional prop for create button text
  createPermissions?: string[]; // Permisos requeridos para crear
  // Props for additional components
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  customActions?: React.ReactNode;
  //pagination
  hidePagination?: boolean;
}
export interface ColumnSelectorProps<T> {
  columns: DataTableColumn<T>[];
  hiddenColumns: string[];
  onToggleColumn: (columnAccessor: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export type DataGridCardProps<T> = Omit<
  DataGridProps<T>,
  "leftActions" | "simpleData" | "columns"
> & {
  component: ReactNode;
};
