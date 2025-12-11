"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterNomenclator } from "@/types/importers";
import { useMemo } from "react";
import { Badge } from "@mantine/core";

interface Props {
  data: ImporterNomenclator[];
  importerName: string;
}

export default function NomenclatorsListClient({ data, importerName }: Props) {
  const columns = useMemo<DataTableColumn<ImporterNomenclator>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        render: (r) => (
          <span className="font-medium text-gray-900 dark:text-gray-100">{r.name}</span>
        ),
      },
      {
        accessor: "categories",
        title: "Categorías",
        render: (r) => (
          <div className="flex flex-wrap gap-1">
            {r.categories.map((cat, idx) => (
              <Badge key={idx} size="sm" variant="light">
                {cat}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessor: "suppliersCount",
        title: "Proveedores",
        render: (r) => (
          <span className="text-sm font-medium">{r.suppliersCount}</span>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        render: (r) => (
          <Badge color={r.isActive ? "green" : "gray"}>
            {r.isActive ? "Activo" : "Inactivo"}
          </Badge>
        ),
      },
      {
        accessor: "createdDatetime",
        title: "Fecha de Creación",
        render: (r) => new Date(r.createdDatetime).toLocaleDateString("es-ES"),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Nomencladores - {importerName}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tipos de productos que pueden vender los proveedores de esta importadora
        </p>
      </div>

      <DataGrid<ImporterNomenclator>
        simpleData={data}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        emptyText="No hay nomencladores registrados"
      />
    </div>
  );
}
