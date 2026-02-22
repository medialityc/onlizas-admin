import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeStoreFormSection } from "@/sections/stores/components/welcome-store-form-section";

export const metadata: Metadata = {
  title: "Paso 2: Configura una tienda | Onlizas",
};

export default async function WelcomeStoresPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.storeCount && data.storeCount > 0) {
    redirect("/dashboard/welcome/warehouses");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-info">
            Paso 2 de 6
          </p>
          <h1 className="text-xl font-bold">Configura tu primera tienda</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Crea al menos una tienda donde se mostrarán y venderán tus
            productos. Puedes administrar varias tiendas más adelante.
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
        <WelcomeStoreFormSection afterCreateRedirectTo="/dashboard/welcome/warehouses" />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/products">
          <Button variant="outline" size="sm">
            Anterior: Productos
          </Button>
        </Link>
        <Link href="/dashboard/welcome/warehouses">
          <Button variant="outline" size="sm">
            Siguiente: Almacenes
          </Button>
        </Link>
      </footer>
    </div>
  );
}
