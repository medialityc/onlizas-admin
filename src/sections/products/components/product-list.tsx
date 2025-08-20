"use client";

import React, { useCallback } from "react";
import { Product, ProductSearchParams, GetAllProducts } from "@/types/products";
import { DataGrid } from "@/components/datagrid/datagrid";
import Badge from "@/components/badge/badge";
import ActionsMenu from "@/components/menu/actions-menu";
import { paths } from "@/config/paths";
import { useRouter } from "next/navigation";
import { DataTableColumn } from "mantine-datatable";
import Link from "next/link";
import useFiltersUrl from "@/hooks/use-filters-url";

interface ProductListProps {
  data?: GetAllProducts;
  searchParams: ProductSearchParams;
  onSearchParamsChange?: (params: ProductSearchParams) => void;
}

export function ProductList({
  data,
  searchParams,
  onSearchParamsChange,
}: ProductListProps) {
  const router = useRouter();

  const { updateFiltersInUrl } = useFiltersUrl();

  // const createModal = getModalState("create");

  const handleCreateProduct = useCallback(() => {
    router.push("/dashboard/products/new");
  }, [router]);

  const handleView = (product: Product) => {
    router.push(paths.dashboard.products.view(product.id));
  };

  const handleEdit = (product: Product) => {
    router.push(paths.dashboard.products.edit(product.id));
  };

  const columns: DataTableColumn<Product>[] = [
    {
      accessor: "name",
      title: "Nombre",
      sortable: true,
      render: (product) => (
        <div className="font-medium">
          <Link
            href={paths.dashboard.products.view(product.id)}
            className="hover:text-primary"
          >
            {product.name}
          </Link>
        </div>
      ),
    },
    {
      accessor: "categories",
      title: "Categoría",
      sortable: true,
      render: (product) => (
        <div>
          {product.categories?.length > 0
            ? product.categories.map((cat) => cat.name).join(", ")
            : "Sin categoría"}
        </div>
      ),
    },
    {
      accessor: "isActive",
      title: "Estado",
      sortable: true,
      render: (product) => (
        <Badge
          variant={product.isActive ? "outline-success" : "outline-secondary"}
        >
          {product.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessor: "suppliers",
      title: "Proveedores",
      sortable: true,
      render: (product) => (
        <div>
          {product.suppliers?.length > 0
            ? product.suppliers.map((sup) => sup.name).join(", ")
            : "Sin proveedores"}
        </div>
      ),
    },
    {
      accessor: "actions",
      title: "Acciones",
      width: 100,
      sortable: true,
      render: (product) => (
        <ActionsMenu
          onViewDetails={() => handleView(product)}
          onEdit={() => handleEdit(product)}
          isActive={product.isActive}
        />
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Productos</h1>
        </div>
        <DataGrid
          data={data}
          columns={columns}
          onCreate={handleCreateProduct}
          searchParams={searchParams}
          onSearchParamsChange={(p: ProductSearchParams) => {
            updateFiltersInUrl(p);
            onSearchParamsChange?.(p);
          }}
          searchPlaceholder="Buscar productos..."
          emptyText="No se encontraron productos"
          createText="Nuevo Producto"
          className="mt-6"
        />
      </div>
      {/* <ProductCreateModal
        open={createModal.open}
        onClose={() => closeModal("create")}
      /> */}
    </>
  );
}
