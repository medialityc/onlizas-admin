"use client";

import SummaryCards from "@/sections/dashboard/summary-cards";
import PieChart from "@/sections/dashboard/charts/pie-chart";
import InteractiveSummary, {
  buildSupplierSummary,
} from "@/sections/dashboard/components/interactive-summary";
import RecentActivityTimeline from "@/sections/dashboard/components/recent-activity-timeline";
import QuickStats from "@/sections/dashboard/components/quick-stats";
import GroupedSummary from "@/sections/dashboard/components/grouped-summary";
import { ApiResponse } from "@/types/fetch/api";
import { SupplierDashboard } from "@/types/dashboard";
import { title } from "node:process";

interface Props {
  dashboardPromise: ApiResponse<SupplierDashboard>;
}

export default function SupplierDashboardContainer({
  dashboardPromise,
}: Props) {
  const d = dashboardPromise.data;

  const cards = [
    { title: "Mis Productos", value: `${d?.totalProducts ?? 0}` },
    { title: "Órdenes", value: `${d?.totalOrders ?? 0}` },
    { title: "Tiendas", value: `${d?.totalStores ?? 0}` },
    { title: "Ingresos", value: `${d?.totalRevenue ?? 0}` },
    { title: "Inventarios", value: `${d?.totalInventories ?? 0}` },
    { title: "Alertas de stock", value: `${d?.lowStockAlerts ?? 0}` },
    { title: "Productos", value: `${d?.totalProducts ?? 0}` },
    { title: "Inventarios", value: `${d?.totalInventories ?? 0}` },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-4">
        {/* Tarjetas de resumen para rellenar mejor el layout */}
        <SummaryCards cards={cards} />
      </div>

      <InteractiveSummary items={buildSupplierSummary(d)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <RecentActivityTimeline
            title="Actividad reciente"
            activities={(d?.recentActivities ?? []) as any}
          />
          {/* Charts with real data for supplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
              title="Estado de Productos"
              segments={[
                {
                  label: "Activos",
                  value: d?.activeProducts ?? 0,
                  color: "#4f46e5",
                },
                {
                  label: "Pend. aprobación",
                  value: d?.pendingApprovalProducts ?? 0,
                  color: "#f59e0b",
                },
              ]}
            />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <GroupedSummary
            sections={[
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
                  {
                    label: "Pend. aprobación",
                    value: d?.pendingApprovalProducts ?? 0,
                    color: "#f59e0b",
                  },
                ],
              },
              {
                title: "Inventarios",
                items: [
                  {
                    label: "Totales",
                    value: d?.totalInventories ?? 0,
                    color: "#4f46e5",
                  },
                  {
                    label: "Activos",
                    value: d?.activeInventories ?? 0,
                    color: "#06b6d4",
                  },
                  {
                    label: "Alertas stock",
                    value: d?.lowStockAlerts ?? 0,
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
                    label: "Este mes",
                    value: d?.revenueThisMonth ?? 0,
                    color: "#06b6d4",
                  },
                ],
              },
              {
                title: "Tiendas",
                items: [
                  {
                    label: "Activas",
                    value: d?.activeStores ?? 0,
                    color: "#4f46e5",
                  },
                  {
                    label: "Totales",
                    value: d?.totalStores ?? 0,
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
                    label: "Este mes",
                    value: d?.reviewsThisMonth ?? 0,
                    color: "#f59e0b",
                  },
                  {
                    label: "Promedio",
                    value: d?.averageRating ?? 0,
                    color: "#10b981",
                  },
                  {
                    label: "Actual",
                    value: d?.approvalStatus?.currentRating ?? 0,
                    color: "#06b6d4",
                  },
                ],
              },
            ]}
          />
          <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md">
            <h3 className="text-lg font-semibold">Estado de aprobación</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>Estado</div>
              <div className="text-right font-semibold">
                {d?.approvalStatus?.state ?? ""}
              </div>
              <div>Aprobado</div>
              <div className="text-right font-semibold">
                {d?.approvalStatus?.isApproved ? "Sí" : "No"}
              </div>
              <div>Fecha aprobación</div>
              <div className="text-right font-semibold">
                {d?.approvalStatus?.approvedAt
                  ? new Date(d.approvalStatus.approvedAt).toLocaleString()
                  : "-"}
              </div>
              <div>Expira</div>
              <div className="text-right font-semibold">
                {d?.approvalStatus?.expirationDate
                  ? new Date(d.approvalStatus.expirationDate).toLocaleString()
                  : "-"}
              </div>
              <div>Categorías aprobadas</div>
              <div className="text-right font-semibold">
                {d?.approvalStatus?.approvedCategoriesCount ?? 0}
              </div>
            </div>
          </div>
          <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md">
            <h3 className="text-lg font-semibold">Top productos</h3>
            <ul className="mt-3 space-y-2">
              {(d?.topSellingProducts ?? []).slice(0, 5).map((p, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.productImage}
                        alt={p.productName}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-200" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{p.productName}</div>
                      <div className="text-xs text-gray-500">
                        Ventas: {p.salesCount}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${p.totalRevenue}</div>
                </li>
              ))}
              {(!d?.topSellingProducts ||
                d?.topSellingProducts.length === 0) && (
                <li className="text-sm text-gray-500">
                  No hay datos de ventas aún.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
