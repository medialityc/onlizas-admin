import { PlusIcon } from "@heroicons/react/24/solid";
import { ColumnSelector } from "./column-selector";
import { DataTableColumn } from "mantine-datatable";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

interface DataGridHeaderProps<T> {
  enableSearch: boolean;
  enableColumnToggle: boolean;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  createLoading?: boolean;
  createText?: string;
  createPermissions?: string[]; // Permisos requeridos para crear
  columns: DataTableColumn<T>[];
  hiddenColumns: string[];
  onToggleColumn: (columnAccessor: string) => void;
  showColumnSelector: boolean;
  onToggleColumnSelector: () => void;
  // Nuevas props para componentes adicionales
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  customActions?: React.ReactNode;
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
  createPermissions,
  columns,
  hiddenColumns,
  onToggleColumn,
  showColumnSelector,
  onToggleColumnSelector,
  leftActions,
  rightActions,
  customActions,
 
}: DataGridHeaderProps<T>) {
  // Obtener permisos del usuario
  const { data: permissions = [] } = usePermissions();

  // Función helper para verificar permisos
  const hasPermission = (requiredPermissions?: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every(perm => permissions.some(p => p.code === perm));
  };
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
        {onCreate && hasPermission(createPermissions) && (
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
