import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getSupplierItemsCount } from "@/services/dashboard";
import { Button } from "@/components/button/button";

export const metadata: Metadata = {
  title: "Bienvenido proveedor | Onlizas",
};

const STEP_ORDER: Array<{
  id: string;
  label: string;
  description: string;
  counterKey:
    | "productCount"
    | "storeCount"
    | "warehouseCount"
    | "zoneCount"
    | "inventoryCount"
    | "bankAccountCount";
}> = [
  {
    id: "products",
    label: "Productos",
    description: "Crea tu catálogo inicial de productos.",
    counterKey: "productCount",
  },
  {
    id: "stores",
    label: "Tiendas",
    description: "Configura los canales donde venderás.",
    counterKey: "storeCount",
  },
  {
    id: "warehouses",
    label: "Almacenes",
    description: "Define desde dónde prepararás tus pedidos.",
    counterKey: "warehouseCount",
  },
  {
    id: "zones",
    label: "Zonas de entrega",
    description: "Indica a qué zonas puedes enviar.",
    counterKey: "zoneCount",
  },
  {
    id: "acdata",
    label: "Cuentas bancarias",
    description: "Registra las cuentas para recibir tus cobros.",
    counterKey: "bankAccountCount",
  },
  {
    id: "inventory",
    label: "Inventario",
    description: "Asocia stock real a tus productos.",
    counterKey: "inventoryCount",
  },
];

export default async function WelcomePage() {
  const { data } = await getSupplierItemsCount();

  if (!data) {
    // Si por alguna razón no hay datos, volvemos al dashboard normal
    redirect("/dashboard");
  }

  if (data.inventoryCount > 0) {
    // Ya tiene inventario, no necesita la guía
    redirect("/dashboard");
  }

  const firstPending = STEP_ORDER.find((step) => data[step.counterKey] === 0);

  if (!firstPending) {
    redirect("/dashboard");
  }

  const currentStepIndex =
    STEP_ORDER.findIndex((step) => step.id === firstPending.id) + 1;
  const totalSteps = STEP_ORDER.length;

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <section className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800/60 dark:bg-gray-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-info">
              Guía de configuración inicial
            </p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Bienvenido a Onlizas
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Esta vista te acompaña paso a paso para dejar tu cuenta lista:
              crear productos, configurar tiendas y almacenes, (de forma
              opcional) zonas de entrega, y como último paso crear el inventario
              antes de registrar tus cuentas bancarias para cobrar. Puedes
              completarla a tu ritmo, siempre retomando desde donde la dejaste.
            </p>
            <p className="text-xs text-muted-foreground">
              Progreso actual: paso {currentStepIndex} de {totalSteps}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              Tu siguiente paso: {firstPending.label}
            </span>
            <Link href={`/dashboard/welcome/${firstPending.id}`}>
              <Button size="sm">Comenzar configuración</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          ¿Qué vas a hacer en esta guía?
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {STEP_ORDER.map((step) => {
            const count = data[step.counterKey] ?? 0;
            const isDone = count > 0;

            return (
              <div
                key={step.id}
                className="flex flex-col justify-between rounded-xl border bg-white/90 p-4 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-950/80"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {step.label}
                    </h3>
                    <span
                      className={
                        isDone
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-200"
                      }
                    >
                      {isDone ? "Completado" : "Pendiente"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {count > 0
                      ? `${count} elemento${count > 1 ? "s" : ""} creado${
                          count > 1 ? "s" : ""
                        }`
                      : "Aún no has configurado este paso"}
                  </span>
                  {!isDone && step.id === firstPending.id && (
                    <Link href={`/dashboard/welcome/${step.id}`}>
                      <Button variant="outline">Ir a este paso</Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
