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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Productos
          </h1>
          <p className="text-muted-foreground mt-1">
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
  );
}
