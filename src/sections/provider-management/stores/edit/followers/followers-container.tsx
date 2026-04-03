"use client";

import { useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import type { SearchParams } from "@/types/fetch/request";
import { PAGE_SIZES } from "@/components/datagrid/constants";
import { useDataGridHandlers } from "@/components/datagrid/hooks";
import { getStoreFollowers, type StoreFollower } from "@/services/stores";
import { buildQueryParams } from "@/lib/request";
import type { Store } from "@/types/stores";

interface Props {
  store: Store;
}

export default function FollowersContainer({ store }: Props) {
  const [params, setParams] = useState<SearchParams>({
    page: 1,
    pageSize: PAGE_SIZES[0],
    search: "",
  });

  const { handleSearch, handlePageChange, handlePageSizeChange } =
    useDataGridHandlers({
      searchParams: params,
      onSearchParamsChange: setParams,
    });

  const queryParams = useMemo(() => buildQueryParams(params), [params]);

  const { data: response, isFetching } = useQuery({
    queryKey: ["store-followers", store.id, queryParams],
    queryFn: () => getStoreFollowers(store.id, queryParams),
    select: (res) =>
      res.data ?? {
        data: [],
        totalCount: 0,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? PAGE_SIZES[0],
        hasNext: false,
        hasPrevious: false,
      },
    placeholderData: keepPreviousData,
  });

  const columns: DataTableColumn<StoreFollower>[] = useMemo(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (follower) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {follower.name ?? "-"}
          </span>
        ),
      },
      {
        accessor: "email",
        title: "Email",
        sortable: true,
        render: (follower) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {follower.email ?? "-"}
          </span>
        ),
      },
      {
        accessor: "phoneNumber",
        title: "Teléfono",
        sortable: true,
        render: (follower) => (
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {follower.phoneNumber ?? "-"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 p-6">
      <DataGrid<StoreFollower>
        data={response}
        columns={columns}
        searchParams={params}
        onSearchParamsChange={setParams}
        searchPlaceholder="Buscar followers..."
        enableSearch
        enablePagination
        enableSorting
        fetching={isFetching}
      />
    </div>
  );
}
