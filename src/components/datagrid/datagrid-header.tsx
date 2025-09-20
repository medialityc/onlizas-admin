import { PlusIcon } from "@heroicons/react/24/solid";
import { ColumnSelector } from "./column-selector";
import { DataTableColumn } from "mantine-datatable";
import { useHasPermissions } from "@/auth-sso/permissions/hooks";

interface DataGridHeaderProps<T> {
  enableSearch: boolean;
  enableColumnToggle: boolean;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  createLoading?: boolean;
  createText?: string;
  columns: DataTableColumn<T>[];
  hiddenColumns: string[];
  onToggleColumn: (columnAccessor: string) => void;
  showColumnSelector: boolean;
  onToggleColumnSelector: () => void;
  // Nuevas props para componentes adicionales
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  customActions?: React.ReactNode;
  // Permissions
  createPermissions?: string[];
}

export function DataGridHeader<T extends Record<string, any>>({
  enableSearch,
  enableColumnToggle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onCreate,
  createLoading,
  createText,
  columns,
  hiddenColumns,
  onToggleColumn,
  showColumnSelector,
  onToggleColumnSelector,
  leftActions,
  rightActions,
  customActions,
  createPermissions,
}: DataGridHeaderProps<T>) {
  const hasCreatePermission = useHasPermissions(createPermissions || ["CREATE_ALL"]);

  return (
    <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {/* Componentes adicionales del lado izquierdo */}
        {leftActions}

        {enableSearch && (
          <div className="">
            <input
              type="text"
              className="form-input w-auto min-w-[100px] md:min-w-[300px]"
              placeholder={searchPlaceholder || "Buscar"}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Componentes adicionales del lado derecho (antes de los botones predeterminados) */}
        {rightActions}

        {enableColumnToggle && (
          <ColumnSelector
            columns={columns}
            hiddenColumns={hiddenColumns}
            onToggleColumn={onToggleColumn}
            isOpen={showColumnSelector}
            onToggle={onToggleColumnSelector}
          />
        )}
        {onCreate && hasCreatePermission && (
          <button
            type="button"
            className="btn btn-primary text-white dark:text-white flex gap-2"
            onClick={onCreate}
          >
            {createLoading ? (
              <span className="animate-pulse">Creando ...</span>
            ) : (
              <>
                <PlusIcon className="h-5 w-5" />
                {createText || "Crear"}
              </>
            )}
          </button>
        )}

        {/* Componentes adicionales personalizados (después de todos los botones) */}
        {customActions}
      </div>
    </div>
  );
}
