// TODO: Dejar separado pero empezar con la tabla de gestión de clientes

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Onlizas",
  description: "Admin dashboard overview with user statistics and analytics",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

import React from "react";
import SummaryCards from "@/sections/dashboard/summary-cards";
import TopStores from "@/sections/dashboard/charts/top-stores";
import UsersTraffic from "@/sections/dashboard/charts/users-traffic";
import TopProducts from "@/sections/dashboard/charts/top-products";
import DonutRevenue from "@/sections/dashboard/charts/donut-revenue";
import OrderStatusPie from "@/sections/dashboard/charts/order-status-pie";
import SalesFunnel from "@/sections/dashboard/charts/sales-funnel";

const mock = {
  summary: [
    { title: "Ventas hoy", value: "$12,430" },
    { title: "Nuevos usuarios (hoy)", value: 124 },
    { title: "Pedidos pendientes", value: 8 },
    { title: "Productos activos", value: 3_241 },
  ],
  topStores: [
    { name: "Tienda A", sales: 1240 },
    { name: "Tienda B", sales: 980 },
    { name: "Tienda C", sales: 720 },
    { name: "Tienda D", sales: 560 },
  ],
  usersTraffic: [
    { label: "2025-10-24", users: 120 },
    { label: "2025-10-25", users: 150 },
    { label: "2025-10-26", users: 180 },
    { label: "2025-10-27", users: 210 },
    { label: "2025-10-28", users: 240 },
    { label: "2025-10-29", users: 300 },
    { label: "2025-10-30", users: 420 },
  ],
  topProducts: [
    { name: "Producto X", qty: 1240 },
    { name: "Producto Y", qty: 980 },
    { name: "Producto Z", qty: 720 },
  ],
  revenueByRegion: [
    { label: "Norte", value: 12400, color: "#06b6d4" },
    { label: "Sur", value: 8200, color: "#4f46e5" },
    { label: "Este", value: 6400, color: "#f97316" },
    { label: "Oeste", value: 4200, color: "#10b981" },
  ],
  orderStatus: [
    { label: "Pending", value: 8, color: "#f97316" },
    { label: "Shipped", value: 42, color: "#06b6d4" },
    { label: "Delivered", value: 320, color: "#10b981" },
    { label: "Cancelled", value: 12, color: "#ef4444" },
  ],
  funnel: [
    { label: "Visits", value: 12000 },
    { label: "Add to Cart", value: 4200 },
    { label: "Checkout", value: 900 },
    { label: "Purchases", value: 420 },
  ],
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <SummaryCards cards={mock.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UsersTraffic data={mock.usersTraffic} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <TopStores data={mock.topStores} />
        </div>
        <TopProducts data={mock.topProducts} />
        <DonutRevenue data={mock.revenueByRegion} />
        <SalesFunnel stages={mock.funnel} />
      </div>
    </div>
  );
}
