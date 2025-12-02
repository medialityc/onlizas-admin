import ProductsServerWrapper from "@/sections/products/containers/products-server-wrapper";
import { Suspense } from "react";

/**
 * Skeleton de carga para la lista de productos
 */
function ProductsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Página de productos - Server Component
 *
 * Utiliza el nuevo ProductsServerWrapper que:
 * - Obtiene permisos en el servidor (sin delay de cliente)
 * - Pre-fetchea datos según el rol del usuario
 * - Renderiza el componente apropiado (admin/supplier)
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<ProductsListSkeleton />}>
      <ProductsServerWrapper query={params} />
    </Suspense>
  );
}
