import { Suspense } from "react";

function ProductsListFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-6 bg-gray-200 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-5/6" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  console.log(searchParams);

  // Server-side: fetch current user and load products for that supplier.
  // Avoid using client hooks (useQuery) in this server component.

  return <Suspense fallback={<ProductsListFallback />}>New</Suspense>;
}
