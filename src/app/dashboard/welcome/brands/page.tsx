import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { WelcomeBrandFormSection } from "@/sections/brands/components/welcome-brand-form-section";

export const metadata: Metadata = {
  title: "Paso 1: Crea una marca | Onlizas",
};

export default async function WelcomeBrandsPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.brandCount && data.brandCount > 0) {
    redirect("/dashboard/welcome/products");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-info">
            Paso 1 de 7
          </p>
          <h1 className="text-xl font-bold">Crea tu primera marca</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Registra una marca para organizar tus productos desde el inicio.
            Después podrás crear más marcas cuando lo necesites.
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
        <WelcomeBrandFormSection afterCreateRedirectTo="/dashboard/welcome/products" />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>Primer paso de la guía de configuración.</span>
        <Link href="/dashboard/welcome/products">
          <Button variant="outline" size="sm">
            Siguiente: Productos
          </Button>
        </Link>
      </footer>
    </div>
  );
}
