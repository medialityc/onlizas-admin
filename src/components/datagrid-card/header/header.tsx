import { PlusIcon } from "@heroicons/react/24/solid";
import FilterSearch from "./header-search";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "../../../lib/permissions";

interface DataGridHeaderProps {
  enableSearch: boolean;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  createLoading?: boolean;
  createText?: string;
  rightActions?: React.ReactNode;
  createPermissions?: string[];
}

export function Header({
  enableSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onCreate,
  createLoading,
  createText,
  rightActions,
  createPermissions,
}: DataGridHeaderProps) {
  const isActions = onCreate || rightActions;
  const hideHeader = enableSearch || isActions;

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasCreatePermission = hasPermission(
    createPermissions || [PERMISSION_ENUM.CREATE]
  );

  if (!hideHeader) return null;
  return (
    <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 flex-1 !w-full">
        {enableSearch && (
          <FilterSearch
            onSearch={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            value={searchValue}
            className="w-full"
          />
        )}
      </div>

      {Boolean(isActions) && (
        <div className="flex items-center gap-3 ml-4">
          {rightActions}
          {onCreate && hasCreatePermission && (
            <button
              type="button"
              className="btn btn-primary dark:text-textColor flex gap-2"
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
        </div>
      )}
    </div>
  );
}
