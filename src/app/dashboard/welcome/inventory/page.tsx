import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "zas-sso-client";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeInventoryFormSection } from "@/sections/inventory-provider/components/welcome-inventory-form-section";

export const metadata: Metadata = {
  title: "Paso 6: Crea tu inventario | Onlizas",
};

export default async function WelcomeInventoryPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.inventoryCount && data.inventoryCount > 0) {
    redirect("/dashboard");
  }

  const session = await getServerSession();
  const userId = session?.user?.id?.toString();

  if (!userId) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-info">
            Paso 6 de 6
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
        <WelcomeInventoryFormSection
          providerId={userId}
          afterCreateRedirectTo={""}
        />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/acdata">
          <Button variant="outline" size="sm">
            Anterior: Cuenta bancaria
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button size="sm">Finalizar y ver dashboard</Button>
        </Link>
      </footer>
    </div>
  );
}
