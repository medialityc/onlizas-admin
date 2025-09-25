"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { GetAllProducts } from "@/types/products";

import { SupplierProductList } from "../components/supplier-product-list";

interface ProductsListContainerProps {
  productsPromise: ApiResponse<GetAllProducts>;
  query: SearchParams;
}

export default function SupplierProductsListContainer({
  productsPromise,
  query,
}: ProductsListContainerProps) {
  const productsResponse = productsPromise;
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Mis Productos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra tus productos
            </p>
          </div>
        </div>

        <SupplierProductList
          data={productsResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
