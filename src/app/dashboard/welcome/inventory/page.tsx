import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import InventoryServerWrapper from "@/sections/inventory-provider/containers/inventory-server-wrapper";
import { InventoryListSkeleton } from "@/sections/inventory-provider/components/skeleton/inventory-list-skeleton";
import type { SearchParams } from "@/types/fetch/request";

export const metadata: Metadata = {
  title: "Paso 5: Crea tu inventario | Onlizas",
};

export default async function WelcomeInventoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { data } = await getSupplierItemsCount();

  if (data?.inventoryCount && data.inventoryCount > 0) {
    redirect("/dashboard/welcome/acdata");
  }

  const search = await searchParams;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-info">
            Paso 5 de 6
          </p>
          <h1 className="text-xl font-bold">Crea tu primer inventario</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Este es el último paso de configuración: genera un inventario que
            relacione producto, tienda, almacén y, si aplican, zonas de entrega.
            Este será el stock real disponible para la venta.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Salir a dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-white/90 p-4 shadow-sm dark:bg-gray-950/80">
        <Suspense fallback={<InventoryListSkeleton />}>
          <InventoryServerWrapper
            query={search}
            afterCreateRedirectTo="/dashboard/welcome/acdata"
          />
        </Suspense>
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/zones">
          <Button variant="outline" size="sm">
            Anterior: Zonas de entrega
          </Button>
        </Link>
        <Link href="/dashboard/welcome/acdata">
          <Button variant="outline" size="sm">
            Siguiente: Cuenta bancaria
          </Button>
        </Link>
      </footer>
    </div>
  );
}
