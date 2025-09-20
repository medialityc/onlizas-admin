"use client";

import { DataGridHeader } from "@/components/datagrid";
import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useHasPermissions } from "@/auth-sso/permissions/hooks";

type StoreListToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export function StoreListToolbar({
  searchValue,
  onSearchChange,
  onCreate,
}: StoreListToolbarProps) {
  // Control de permisos
  const hasCreatePermission = useHasPermissions(["CREATE_ALL"]);

  return (
    <DataGridHeader
      enableSearch
      searchPlaceholder="Buscar tiendas..."
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      rightActions={
        hasCreatePermission
          ? [
              <Button
                key="create"
                onClick={onCreate}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
              >
                <PlusIcon className="w-4 h-4 mr-2 text-white" />
                Crear tienda
              </Button>,
            ]
          : []
      }
      enableColumnToggle={false}
      customActions={null}
      columns={[]}
      hiddenColumns={[]}
      onToggleColumn={() => {}}
      showColumnSelector={false}
      onToggleColumnSelector={() => {}}
    />
  );
}

export default StoreListToolbar;
