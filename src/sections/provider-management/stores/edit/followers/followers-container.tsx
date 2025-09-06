"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import type { SearchParams } from "@/types/fetch/request";
import type { PaginatedResponse } from "@/types/common";
import { PAGE_SIZES } from "@/components/datagrid/constants";
import { useDataGridHandlers } from "@/components/datagrid/hooks";
import { getStoreFollowers, type StoreFollower } from "@/services/stores";
import type { Store } from "@/types/stores";

interface Props {
    store: Store;
}

export default function FollowersContainer({ store }: Props) {
    // Params locales (no vienen desde la page)
    const [params, setParams] = useState<SearchParams>({ page: 1, pageSize: PAGE_SIZES[0], search: "" });
    const { handleSearch, handlePageChange, handlePageSizeChange } = useDataGridHandlers({
        searchParams: params,
        onSearchParamsChange: setParams,
    });

    // Estado para la data del endpoint
    const [response, setResponse] = useState<PaginatedResponse<StoreFollower>>({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: PAGE_SIZES[0],
        hasNext: false,
        hasPrevious: false,
    });
    const [loading, setLoading] = useState(false);

    // Cargar followers al entrar al tab y cuando cambien los params
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const res = await getStoreFollowers(store.id, params);
                if (!cancelled && !res.error && res.data) {
                    setResponse(res.data);
                }
            } catch (e) {
                // visible en consola; la UI mostrará "No hay registros" cuando data vacía
                console.error("Error al cargar followers:", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [store.id, params.page, params.pageSize, params.search]);

    const columns: DataTableColumn<StoreFollower>[] = useMemo(() => ([

        {
            accessor: "name", title: "Nombre", sortable: true, render: (follower) => (
                <span className="text-sm text-gray-500 dark:text-gray-300">
                    {follower.name ?? "-"}
                </span>
            ),
        },
        {
            accessor: "email", title: "Email", sortable: true, render: (follower) => (
                <span className="text-sm text-gray-500 dark:text-gray-300">
                    {follower.email ?? "-"}
                </span>
            ),
        },
        {
            accessor: "phoneNumber", title: "Teléfono", sortable: true, render: (follower) => (
                <span className="text-sm text-gray-500 dark:text-gray-300">
                    {follower.phoneNumber ?? "-"}
                </span>
            ),
        },
    ]), []);

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
            />
        </div>
    );
}
