"use client";

import React, { useCallback } from "react";
import { Product, ProductSearchParams, GetAllProducts } from "@/types/products";
import { DataGrid } from "@/components/datagrid/datagrid";
import Badge from "@/components/badge/badge";
import ActionsMenu from "@/components/menu/actions-menu";
import { paths } from "@/config/paths";
import { useRouter } from "next/navigation";
import { useModalState } from "@/hooks/use-modal-state";
import { DataTableColumn } from "mantine-datatable";
import Link from "next/link";
import useFiltersUrl from "@/hooks/use-filters-url";
import {
  CubeIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface ProductListProviderProps {
  data?: GetAllProducts;
  searchParams: ProductSearchParams;
  onSearchParamsChange?: (params: ProductSearchParams) => void;
}

export function ProductListProvider({
  data,
  searchParams,
  onSearchParamsChange,
}: ProductListProviderProps) {
  const router = useRouter();
  const { getModalState, openModal, closeModal } = useModalState();
  const { updateFiltersInUrl } = useFiltersUrl();

  const createModal = getModalState("create");

  const handleCreateProduct = useCallback(() => {
    router.push("/provider/products/new");
  }, [router]);

  const handleView = (product: Product) => {
    router.push(paths.provider.products.view(product.id));
  };

  const handleEdit = (product: Product) => {
    router.push(paths.provider.products.edit(product.id));
  };

  const columns: DataTableColumn<Product>[] = [
    {
      accessor: "name",
      title: "Nombre",
      sortable: true,
      render: (product) => (
        <div className="font-medium">
          <Link
            href={paths.provider.products.view(product.id)}
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
    /* {
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
    }, */
    {
      accessor: "actions",
      title: "Acciones",
      width: 100,
      sortable: true,
      render: (product) => (
        <ActionsMenu
          onViewDetails={() => handleView(product)}
          onEdit={() => handleEdit(product)}
          //isActive={product.isActive}
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

        {/* Static summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
            <div className="p-2 rounded-full bg-sky-50 dark:bg-sky-900/10">
              <CubeIcon className="h-8 w-8 text-sky-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Productos</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                156
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
            <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/10">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Productos Activos</div>
              <div className="text-3xl font-extrabold text-green-600">142</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
            <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-800/20">
              <ArchiveBoxIcon className="h-8 w-8 text-gray-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Stock Total</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                2,847
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 min-h-[92px] dark:bg-gray-900 dark:border-gray-800">
            <div className="p-2 rounded-full bg-yellow-50 dark:bg-yellow-900/10">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Valor Inventario</div>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                $284,750
              </div>
            </div>
          </div>
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
    </>
  );
}
