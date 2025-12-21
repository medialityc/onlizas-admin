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
import DashboardServerWrapper from "@/sections/dashboard/containers/dashboard-server-wrapper";

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

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardServerWrapper />
    </Suspense>
  );
}
