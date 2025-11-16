"use client";
import { Package, Clock, TruckIcon, CheckCircle } from "lucide-react";
import { OrderStatus, SubOrder } from "@/types/order";

type Stat = { label: string; value: number; icon: any; color: string };

export function SupplierOrderStatsCards({
  subOrders,
}: {
  subOrders: SubOrder[];
}) {
  const stats: Stat[] = [
    {
      label: "Total Órdenes",
      value: new Set(subOrders.map((s) => s.orderId)).size,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Pendientes",
      value: subOrders.filter((s) => s.status === OrderStatus.Pending).length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "En Proceso",
      value: subOrders.filter(
        (s) =>
          s.status === OrderStatus.Processing || s.status === OrderStatus.Sent
      ).length,
      icon: TruckIcon,
      color: "text-blue-600",
    },
    {
      label: "Completadas",
      value: subOrders.filter(
        (s) =>
          s.status === OrderStatus.Completed ||
          s.status === OrderStatus.Received
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <stat.icon className={`h-10 w-10 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
