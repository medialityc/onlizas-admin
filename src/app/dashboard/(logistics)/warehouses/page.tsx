import WarehousesServerWrapper from "@/sections/warehouses/containers/warehouses-server-wrapper";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almacenes General - Onlizas",
  description: "Gestión de almacenes del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

/**
 * Skeleton de carga para la lista de almacenes
 */
function WarehousesListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Página de almacenes - Server Component
 *
 * Utiliza el nuevo WarehousesServerWrapper que:
 * - Obtiene permisos en el servidor (sin delay de cliente)
 * - Pre-fetchea datos según el rol del usuario
 * - Renderiza el componente apropiado (admin/supplier)
 */
export default async function WarehousesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<WarehousesListSkeleton />}>
      <WarehousesServerWrapper query={params} />
    </Suspense>
  );
}
