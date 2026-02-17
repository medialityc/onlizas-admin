import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import InventoryProviderList from "../inventory-provider-card/inventory-provider-list";
import { GetAllInventoryProviderResponse } from "@/types/inventory";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  data?: GetAllInventoryProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  onCreate: VoidFunction;
}

export function InventoryCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
  onCreate,
}: Props) {
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar inventario..."
        onCreate={onCreate}
        createText="Crear inventario"
        enableColumnToggle={false}
        createPermissions={[
          PERMISSION_ENUM.SUPPLIER_CREATE,
          PERMISSION_ENUM.CREATE,
        ]}
        component={
          <InventoryProviderList
            data={data?.data}
            searchParams={searchParams}
          />
        }
      />
    </>
  );
}
