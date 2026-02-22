import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "zas-sso-client";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeZoneFormSection } from "@/sections/zones/components/welcome-zone-form-section";

export const metadata: Metadata = {
  title: "Paso 4: Configura zonas de entrega | Onlizas",
};

export default async function WelcomeZonesPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.zoneCount && data.zoneCount > 0) {
    redirect("/dashboard/welcome/inventory");
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
            Paso 4 de 6 (opcional)
          </p>
          <h1 className="text-xl font-bold">Configura tus zonas de entrega</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Este paso es opcional. Si lo necesitas, define zonas de entrega para
            indicar dónde puedes distribuir tus productos.
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
        <WelcomeZoneFormSection afterCreateRedirectTo="/dashboard/welcome/inventory" />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/warehouses">
          <Button variant="outline" size="sm">
            Anterior: Almacenes
          </Button>
        </Link>
        <Link href="/dashboard/welcome/inventory">
          <Button variant="outline" size="sm">
            Siguiente: Inventario
          </Button>
        </Link>
      </footer>
    </div>
  );
}
