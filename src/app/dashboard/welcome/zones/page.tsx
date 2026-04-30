import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "zas-sso-client";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeZoneFormSection } from "@/sections/zones/components/welcome-zone-form-section";

export const metadata: Metadata = {
  title: "Paso 5: Configura zonas de entrega | Onlizas",
};

// MODO DESARROLLO: desactiva redirecciones para probar el flujo
const DEV_MODE = false;

export default async function WelcomeZonesPage() {
  const { data } = await getSupplierItemsCount();

  if (!DEV_MODE && data?.zoneCount && data.zoneCount > 0) {
    redirect("/dashboard/welcome/acdata");
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
            Paso 5 de 7 (opcional)
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
        <WelcomeZoneFormSection afterCreateRedirectTo="/dashboard/welcome/acdata" />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/warehouses">
          <Button variant="outline" size="sm">
            Anterior: Almacenes
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
