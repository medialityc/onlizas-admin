import WarehousePermissionWrapper from "@/sections/warehouses/containers/warehouse-permission-wrapper";
import { PermissionGate } from "@/components/permission/permission-gate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Almacenes General - ZAS Express",
  description: "Gestión de almacenes del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default async function WarehousesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const params = await searchParams;
  // Delegamos lógica de permisos y fetching al wrapper (cliente)
  return (
    <PermissionGate
      loadingFallback={
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
      }
      keepFallbackIfMissing={false}
    >
      <WarehousePermissionWrapper query={params} />
    </PermissionGate>
  );
}
