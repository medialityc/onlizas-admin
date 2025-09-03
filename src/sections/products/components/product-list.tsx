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
import { toggleActiveProduct } from "@/services/products";
import showToast from "@/config/toast/toastConfig";

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

  const handleCreateProduct = useCallback(() => {
    router.push("/dashboard/products/new");
  }, [router]);

  const handleView = (product: Product) => {
    router.push(paths.dashboard.products.view(product.id));
  };

  const handleEdit = (product: Product) => {
    router.push(paths.dashboard.products.edit(product.id));
  };

  const handleToggleActiveProduct = useCallback(async (product: Product) => {
    try {
      const res = await toggleActiveProduct(product?.id as number);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      } else {
        showToast(
          `Producto ${(res.data as unknown as Product)?.isActive ? "activado" : "desactivado"}  correctamente`,
          "success"
        );
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, intente nuevamente", "error");
    }
  }, []);

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
      accessor: "state",
      title: "Estado",
      sortable: true,
      render: (product) => (
        <Badge
          variant={product.state ? "outline-success" : "outline-secondary"}
        >
          {product.state ? "Activo" : "Inactivo"}
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
          isActive={product.state}
          onActive={() => handleToggleActiveProduct(product)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
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
    </>
  );
}
