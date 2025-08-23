"use client";
import { SearchParams } from "@/types/fetch/request";
import { GetAllUsersProviderResponse } from "@/types/users";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import UserProviderCardList from "../user-provider-card/user-provider-card-list";

interface Props {
  data?: GetAllUsersProviderResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function UserProviderCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {

  console.log(data?.data, 'AAA')
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar proveedor..."
        // onCreate={handleInventoryProviderCreate}
        emptyText="No se encontraron proveedor"
        enableColumnToggle={false}
        rightActions={<></>}
        component={
          <UserProviderCardList data={data?.data} searchParams={searchParams} />
        }
      />
    </>
  );
}
