"use client";

import SummaryCards from "@/sections/dashboard/summary-cards";
import PieChart from "@/sections/dashboard/charts/pie-chart";
import InteractiveSummary, {
  buildAdminSummary,
} from "@/sections/dashboard/components/interactive-summary";
import RecentActivityTimeline from "@/sections/dashboard/components/recent-activity-timeline";
import QuickStats from "@/sections/dashboard/components/quick-stats";
import GroupedSummary from "@/sections/dashboard/components/grouped-summary";
import { ApiResponse } from "@/types/fetch/api";
import { AdminDashboard } from "@/types/dashboard";

interface Props {
  dashboardPromise: ApiResponse<AdminDashboard>;
}

export default function AdminDashboardContainer({ dashboardPromise }: Props) {
  const d = dashboardPromise.data;

  // Interactive summary will compute key ratios; full details remain in the right summary panel

  return (
    <div className="space-y-6 p-6">
      {/* <QuickStats
        items={[
          { label: "Usuarios", value: d?.totalUsers ?? 0, color: "#06b6d4" },
          {
            label: "Productos",
            value: d?.totalProducts ?? 0,
            color: "#10b981",
          },
          { label: "Órdenes", value: d?.totalOrders ?? 0, color: "#4f46e5" },
          { label: "Tiendas", value: d?.totalStores ?? 0, color: "#f59e0b" },
        ]}
      /> */}
      <InteractiveSummary items={buildAdminSummary(d)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Charts with real data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PieChart
              title="Órdenes"
              segments={[
                {
                  label: "Pendientes",
                  value: d?.pendingOrders ?? 0,
                  color: "#f97316",
                },
                {
                  label: "Completadas",
                  value: d?.completedOrders ?? 0,
                  color: "#10b981",
                },
              ]}
            />
            <PieChart
              title="Stock de Productos"
              segments={[
                {
                  label: "Con stock",
                  value: d?.productsWithStock ?? 0,
                  color: "#06b6d4",
                },
                {
                  label: "Sin stock",
                  value: d?.productsOutOfStock ?? 0,
                  color: "#ef4444",
                },
              ]}
            />
            <PieChart
              title="Estado de Tiendas"
              segments={[
                {
                  label: "Activas",
                  value: d?.activeStores ?? 0,
                  color: "#4f46e5",
                },
                {
                  label: "Pend. aprobación",
                  value: d?.pendingApprovalStores ?? 0,
                  color: "#f59e0b",
                },
              ]}
            />
          </div>
          <RecentActivityTimeline
            title="Actividad reciente"
            activities={(d?.recentActivities ?? []) as any}
          />
        </div>
      </div>
      <div className="lg:col-span-1 space-y-4">
        <GroupedSummary
          sections={[
            {
              title: "Usuarios",
              items: [
                {
                  label: "Activos",
                  value: d?.activeUsers ?? 0,
                  color: "#06b6d4",
                },
                {
                  label: "Nuevos (mes)",
                  value: d?.newUsersThisMonth ?? 0,
                  color: "#4f46e5",
                },
              ],
            },
            {
              title: "Productos",
              items: [
                {
                  label: "Activos",
                  value: d?.activeProducts ?? 0,
                  color: "#10b981",
                },
                {
                  label: "Con stock",
                  value: d?.productsWithStock ?? 0,
                  color: "#06b6d4",
                },
                {
                  label: "Sin stock",
                  value: d?.productsOutOfStock ?? 0,
                  color: "#ef4444",
                },
              ],
            },
            {
              title: "Órdenes",
              items: [
                {
                  label: "Pendientes",
                  value: d?.pendingOrders ?? 0,
                  color: "#f59e0b",
                },
                {
                  label: "Completadas",
                  value: d?.completedOrders ?? 0,
                  color: "#10b981",
                },
                {
                  label: "Este mes",
                  value: d?.ordersThisMonth ?? 0,
                  color: "#4f46e5",
                },
              ],
            },
            {
              title: "Ingresos",
              items: [
                {
                  label: "Totales",
                  value: d?.totalRevenue ?? 0,
                  color: "#4f46e5",
                },
                {
                  label: "Este mes",
                  value: d?.revenueThisMonth ?? 0,
                  color: "#06b6d4",
                },
              ],
            },
            {
              title: "Tiendas/Almacenes",
              items: [
                {
                  label: "Tiendas activas",
                  value: d?.activeStores ?? 0,
                  color: "#4f46e5",
                },
                {
                  label: "Tiendas pend.",
                  value: d?.pendingApprovalStores ?? 0,
                  color: "#f59e0b",
                },
                {
                  label: "Almacenes",
                  value: d?.totalWarehouses ?? 0,
                  color: "#06b6d4",
                },
              ],
            },
            {
              title: "Reviews",
              items: [
                {
                  label: "Totales",
                  value: d?.totalReviews ?? 0,
                  color: "#4f46e5",
                },
                {
                  label: "Pendientes",
                  value: d?.pendingReviews ?? 0,
                  color: "#f59e0b",
                },
                {
                  label: "Promedio",
                  value: d?.averageRating ?? 0,
                  color: "#10b981",
                },
              ],
            },
            {
              title: "Aprobaciones",
              items: [
                {
                  label: "Pendientes",
                  value: d?.pendingApprovals ?? 0,
                  color: "#f59e0b",
                },
                {
                  label: "Aprobadas (mes)",
                  value: d?.approvedThisMonth ?? 0,
                  color: "#10b981",
                },
                {
                  label: "Rechazadas (mes)",
                  value: d?.rejectedThisMonth ?? 0,
                  color: "#ef4444",
                },
              ],
            },
            {
              title: "Importadores",
              items: [
                {
                  label: "Total",
                  value: d?.importersCount ?? 0,
                  color: "#06b6d4",
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
