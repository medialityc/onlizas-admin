"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { ProductList } from "../components/product-list";
import { GetAllProducts } from "@/types/products";

interface ProductsListContainerProps {
  productsPromise: ApiResponse<GetAllProducts>;
  query: SearchParams;
}

export default function ProductsListContainer({
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
              Gestión de Productos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los productos del sistema y sus datos asociados
            </p>
          </div>
        </div>

        <ProductList
          data={productsResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
        />
      </div>
    </div>
  );
}
