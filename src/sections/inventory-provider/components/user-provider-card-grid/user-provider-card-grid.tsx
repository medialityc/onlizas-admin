"use client";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import UserProviderCardList from "../user-provider-card/user-provider-card-list";
import { GetAllUsersResponse } from "@/types/users";

interface Props {
  data?: GetAllUsersResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function UserProviderCardGrid({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  return (
    <>
      <DataGridCard
        data={data}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar proveedor..."
        emptyText="No se encontraron proveedor"
        enableColumnToggle={false}
        component={
          <UserProviderCardList data={data?.data} searchParams={searchParams} />
        }
      />
    </>
  );
}
