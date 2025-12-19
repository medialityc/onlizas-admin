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
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Gestión de mis Productos
            </h1>
            <p className="text-muted-foreground mt-1">
              Administrar mis productos y sus datos asociados
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
