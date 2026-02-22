import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "zas-sso-client";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeSupplierAccountFormSection } from "@/sections/finance/components/welcome-supplier-account-form-section";

export const metadata: Metadata = {
  title: "Paso 5: Configura tu cuenta bancaria | Onlizas",
};

export default async function WelcomeAcdataPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.bankAccountCount && data.bankAccountCount > 0) {
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
            Paso 5 de 6
          </p>
          <h1 className="text-xl font-bold">Configura tu cuenta bancaria</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Añade al menos una cuenta bancaria para poder recibir los pagos de
            tus ventas en Onlizas.
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
        <WelcomeSupplierAccountFormSection
          supplierId={userId}
          afterCreateRedirectTo="/dashboard/welcome/inventory"
        />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <Link href="/dashboard/welcome/zones">
          <Button variant="outline" size="sm">
            Anterior: Zonas de entrega
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
