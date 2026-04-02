"use client";

import { useMemo } from "react";
import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllWarehouses } from "@/types/warehouses";
import { DataGrid } from "@/components/datagrid/datagrid";
import type { DataTableColumn } from "mantine-datatable";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";
import WarehouseHeader from "../components/warehouse-header/warehouse-header";
import WarehouseMetric from "../components/warehouse-metric/warehouse-metric";
import { NavigationTabs } from "@/components/tab/navigation-tabs";
import { warehousesTabs } from "../config/tabs";
import Badge from "@/components/badge/badge";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  warehousesPromise: ApiResponse<GetAllWarehouses>;
  query: SearchParams;
}

export default function WarehouseListContainer({
  warehousesPromise,
  query,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  const columns: DataTableColumn<WarehouseFormData>[] = useMemo(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (w) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {w.name ?? "-"}
          </span>
        ),
      },
      {
        accessor: "type",
        title: "Tipo",
        sortable: true,
        render: (w) => (
          <Badge
            variant={
              w.type === WAREHOUSE_TYPE_ENUM.warehouse
                ? "outline-primary"
                : "outline-secondary"
            }
            rounded
          >
            {w.type === WAREHOUSE_TYPE_ENUM.warehouse
              ? "General"
              : "Para Proveedor"}
          </Badge>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        render: (w) => (
          <Badge
            variant={w.active ? "outline-success" : "outline-danger"}
            rounded
          >
            {w.active ? "Activo" : "Inactivo"}
          </Badge>
        ),
      },
      {
        accessor: "supplierName",
        title: "Proveedor",
        render: (w) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {w.supplierName ?? "-"}
          </span>
        ),
      },
      {
        accessor: "capacity",
        title: "Capacidad",
        render: (w) =>
          w.capacity != null ? (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {w.capacity} {w.capacityUnit ?? ""}
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          ),
      },
      {
        accessor: "addressName",
        title: "Dirección",
        render: (w) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {w.addressName ?? w.address?.city ?? "-"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "",
        render: (w) => (
          <Link
            href={`/dashboard/warehouses/${
              w.type === WAREHOUSE_TYPE_ENUM.warehouse
                ? WAREHOUSE_TYPE_ENUM.warehouse
                : WAREHOUSE_TYPE_ENUM.virtualwarehouse
            }/${w.id}/edit`}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <PencilSquareIcon className="size-4" />
            Editar
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4">
        <WarehouseHeader />
        <WarehouseMetric />
        <NavigationTabs tabs={warehousesTabs} />
        <DataGrid<WarehouseFormData>
          data={warehousesPromise.data}
          columns={columns}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          searchPlaceholder="Buscar almacén..."
          enableSearch
          enablePagination
          enableSorting
        />
      </div>
    </div>
  );
}
