import Link from "next/link";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  InfoIcon,
  MapPin,
  Package,
  Store,
  Warehouse,
} from "lucide-react";
import { getSupplierItemsCount } from "@/services/dashboard";

export async function SupplierInventorySteps() {
  const { data } = await getSupplierItemsCount();

  const steps = [
    {
      id: "products",
      count: data?.productCount ?? 0,
      icon: Package,
      label: "Paso 1",
      title: "Crea un producto",
      description:
        "Registra el producto en el catálogo para poder asociarlo a tus inventarios.",
      href: "/dashboard/products/new",
      cta: "Ir a productos",
    },
    {
      id: "stores",
      count: data?.storeCount ?? 0,
      icon: Store,
      label: "Paso 2",
      title: "Configura una tienda",
      description:
        "Crea al menos una tienda donde se mostrarán y venderán tus productos.",
      href: "/dashboard/stores",
      cta: "Ir a tiendas",
    },
    {
      id: "warehouses",
      count: data?.warehouseCount ?? 0,
      icon: Warehouse,
      label: "Paso 3",
      title: "Define un almacén",
      description:
        "Registra el almacén desde el cual saldrá el inventario físico.",
      href: "/dashboard/warehouses/new",
      cta: "Ir a almacenes",
    },
    {
      id: "zones",
      count: data?.zoneCount ?? 0,
      icon: MapPin,
      label: "Paso 4",
      title: "Configura zonas de entrega",
      description:
        "(Opcional) Si lo necesitas, crea zonas de entrega para indicar dónde puedes distribuir tus productos.",
      href: "/dashboard/my-zones",
      cta: "Ir a mis zonas",
    },
    {
      id: "acdata",
      count: data?.bankAccountCount ?? 0,
      icon: CreditCard,
      label: "Paso 6",
      title: "Configura tu cuenta bancaria",
      description:
        "Completa los datos de tu cuenta bancaria en tu perfil de proveedor para poder recibir el dinero de tus ventas.",
      href: "/dashboard/my-acdata",
      cta: "Ir a cuentas bancarias",
    },
    {
      id: "inventories",
      count: data?.inventoryCount ?? 0,
      icon: Boxes,
      label: "Paso 5",
      title: "Crea el inventario",
      description:
        "Este es el último paso de configuración: genera un inventario que relacione producto, tienda, almacén y, si aplican, zonas de entrega.",
      href: "/dashboard/inventory/listing",
      cta: "Ir a inventario",
    },
  ];

  const pendingSteps = steps.filter((step) => step.count === 0);

  if (pendingSteps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-info/20 bg-info/5 p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-info text-white">
          <InfoIcon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold">
            ¿Qué necesitas para listar un inventario?
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Sigue estos pasos en orden para poder publicar un inventario
            completo y empezar a vender. Cada tarjeta te lleva directo al módulo
            correspondiente.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-3 max-w-6xl overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ol className="relative flex min-w-max gap-3 px-2 md:gap-4 md:px-3">
          {pendingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.id}>
                <div className="flex h-full min-w-55 max-w-xs flex-col rounded-lg border border-info/20 bg-white/80 p-2.5 shadow-sm first:border-info/40 first:bg-info/5 dark:bg-gray-950/80 sm:p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-info/10 text-info first:bg-info first:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-info/80">
                        Paso {index + 1}
                      </span>
                      <span className="text-sm font-semibold">
                        {step.title}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs opacity-90">{step.description}</p>
                  <Link
                    href={step.href}
                    className="mt-2 inline-flex items-center justify-center rounded-lg border border-info/40 bg-info/5 px-3 py-1.5 text-[11px] font-semibold text-info transition hover:bg-info/15"
                  >
                    {step.cta}
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
