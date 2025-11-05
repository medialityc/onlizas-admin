import ProductsListPermissionWrapper from "@/sections/products/containers/products-list-permission-wrapper";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  return <ProductsListPermissionWrapper query={params} />;
}
