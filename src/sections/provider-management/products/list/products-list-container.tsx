"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { GetAllProducts } from "@/types/products";
import { ProductListProvider } from "./product-list";

interface ProductsListContainerProps {
  productsPromise: Promise<ApiResponse<GetAllProducts>>;
  query: SearchParams;
}

export default function ProductsListProviderContainer({
  productsPromise,
  query,
}: ProductsListContainerProps) {
  const productsResponse = use(productsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <ProductListProvider
      data={productsResponse.data}
      searchParams={query}
      onSearchParamsChange={handleSearchParamsChange}
    />
  );
}
