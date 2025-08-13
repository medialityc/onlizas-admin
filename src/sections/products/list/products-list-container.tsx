"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import { use } from "react";
import { ProductList } from "./product-list";
import { GetAllProducts } from "@/types/products";

interface ProductsListContainerProps {
  productsPromise: Promise<ApiResponse<GetAllProducts>>;
  query: SearchParams;
}

export default function ProductsListContainer ({ productsPromise, query }: ProductsListContainerProps) {
  const productsResponse = use(productsPromise);
  const { updateFiltersInUrl } = useFiltersUrl();

  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  return (
    <ProductList
      data={productsResponse.data}
      searchParams={query}
      onSearchParamsChange={handleSearchParamsChange}
    />
  );
}
