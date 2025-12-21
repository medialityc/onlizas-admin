"use client";

import { useMemo } from "react";
import { Badge } from "@mantine/core";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";

type Nomenclator = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  categories: Array<{
    id: string;
    name: string;
  }>;
};

interface Props {
  importerId: string;
  nomenclators: Nomenclator[];
}

export default function ImporterNomencladoresView({ importerId, nomenclators }: Props) {
  const columns = useMemo<DataTableColumn<Nomenclator>[]>(
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
        render: (r) => {
          const categories = r.categories || [];
          return (
            <div className="flex flex-wrap gap-1">
              {categories.length > 0
                ? categories.map((cat) => (
                    <Badge key={cat.id} size="sm" variant="light">
                      {cat.name}
                    </Badge>
                  ))
                : "-"}
            </div>
          );
        },
      },
      {
        accessor: "createdAt",
        title: "Fecha de creación",
        render: (r) => {
          return r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-ES") : "-";
        },
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
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Nomencladores
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Tipos de productos que pueden vender los proveedores de esta importadora
        </p>
      </div>

      <DataGrid<Nomenclator>
        simpleData={nomenclators}
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
