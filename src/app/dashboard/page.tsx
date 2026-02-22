// TODO: Dejar separado pero empezar con la tabla de gestión de clientes

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Onlizas",
  description: "Admin dashboard overview with user statistics and analytics",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

import { Suspense } from "react";
import Link from "next/link";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { getSupplierItemsCount } from "@/services/dashboard";
import DashboardServerWrapper from "@/sections/dashboard/containers/dashboard-server-wrapper";
import { Button } from "@/components/button/button";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { isSupplier } = await getModulePermissions("dashboard");

  let showOnboardingBanner = false;

  if (isSupplier) {
    const { data } = await getSupplierItemsCount();

    // Si aún no tiene inventario, sugerimos completar la guía inicial
    if ((data?.inventoryCount ?? 0) === 0) {
      showOnboardingBanner = true;
    }
  }

  return (
    <>
      {showOnboardingBanner && (
        <div className="px-4 pt-4 sm:px-6">
          <div className="mb-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-4 text-sm shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  Configuración inicial recomendada
                </p>
                <p className="mt-1 text-xs text-emerald-900 dark:text-emerald-100">
                  Aún no has configurado tu inventario. Te recomendamos seguir
                  la guía paso a paso para dejar tu cuenta lista antes de
                  empezar a operar.
                </p>
              </div>
              <Link href="/dashboard/welcome">
                <Button size="sm" variant="outline">
                  Comenzar configuración
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardServerWrapper />
      </Suspense>
    </>
  );
}
