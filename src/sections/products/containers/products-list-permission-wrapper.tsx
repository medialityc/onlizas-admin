"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import ProductsListContainer from "./products-list-container";
import SupplierProductsListContainer from "./supplier-products-list-container";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getAllMyProducts } from "@/services/products";
import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import Loader from "@/layouts/loading";

type Props = {
  query: SearchParams;
};

export default function ProductsListPermissionWrapper({ query }: Props) {
  const { hasPermission } = usePermissions();

  const hasAdminRetrieve = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierRetrieveOnly =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.RETRIEVE_PRODUCT]);

  const apiQuery: IQueryable = buildQueryParams(query as any);

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      hasAdminRetrieve ? "products-admin" : "products-supplier",
      apiQuery,
    ],
    queryFn: async () => {
      return hasAdminRetrieve
        ? await getAllProducts(apiQuery)
        : await getAllMyProducts(apiQuery);
    },
  });

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-6 panel">
        <p className="text-red-500">
          Error al cargar productos: {(error as any)?.message || "Desconocido"}
        </p>
      </div>
    );

  if (!productsResponse) return null;

  if (hasSupplierRetrieveOnly) {
    return (
      <SupplierProductsListContainer
        productsPromise={productsResponse}
        query={query}
      />
    );
  }

  // Admin (or user with full RETRIEVE) fallback
  return (
    <ProductsListContainer productsPromise={productsResponse} query={query} />
  );
}
