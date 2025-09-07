import { buildQueryParams } from "@/lib/request";

import ProductsListContainer from "@/sections/products/containers/products-list-container";
import { getAllProducts } from "@/services/products";
import { IQueryable } from "@/types/fetch/request";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const productsPromise = await getAllProducts(query);

  return (
    <ProductsListContainer productsPromise={productsPromise} query={params} />
  );
}
