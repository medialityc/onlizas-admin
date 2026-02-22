import type { Metadata } from "next";
import Link from "next/link";
import ProductCreateContainer from "@/sections/products/containers/product-create-container";
import { Button } from "@/components/button/button";
import { getSupplierItemsCount } from "@/services/dashboard";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Paso 1: Crea un producto | Onlizas",
};

export default async function WelcomeProductsPage() {
  const { data } = await getSupplierItemsCount();

  if (data?.productCount && data.productCount > 0) {
    // Si ya creó productos, saltar al siguiente paso pendiente
    redirect("/dashboard/welcome/stores");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-info">
            Paso 1 de 6
          </p>
          <h1 className="text-xl font-bold">Crea tu primer producto</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Empieza registrando al menos un producto en tu catálogo. Luego
            podrás asociarlo a inventarios, tiendas y, si lo necesitas, zonas de
            entrega.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Salir a dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-white/90 p-4 shadow-sm dark:bg-gray-950/80">
        <ProductCreateContainer afterCreateRedirectTo="/dashboard/welcome/stores" />
      </div>

      <footer className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span>
          Próximo paso: configurar una tienda para mostrar tus productos.
        </span>
        <Link href="/dashboard/welcome/stores">
          <Button variant="outline" size="sm">
            Siguiente: Tiendas
          </Button>
        </Link>
      </footer>
    </div>
  );
}
