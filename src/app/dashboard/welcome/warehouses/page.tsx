import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeMeWarehouseFormSection } from "@/sections/warehouses/components/welcome-me-warehouse-form-section";

export const metadata: Metadata = {
  title: "Paso 3: Define un almacén | Onlizas",
};

export default async function WelcomeWarehousesPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.warehouseCount && data.warehouseCount > 0) {
    redirect("/dashboard/welcome/zones");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-info">
            Paso 3 de 6
          </p>
          <h1 className="text-xl font-bold">Registra tu primer almacén</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Crea un almacén desde el cual saldrá el inventario físico de tus
            productos.
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
        <WelcomeMeWarehouseFormSection afterCreateRedirectTo="/dashboard/welcome/zones" />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/stores">
          <Button variant="outline" size="sm">
            Anterior: Tiendas
          </Button>
        </Link>
        <Link href="/dashboard/welcome/zones">
          <Button variant="outline" size="sm">
            Siguiente: Zonas de entrega
          </Button>
        </Link>
      </footer>
    </div>
  );
}
