"use client";
import {
  Package,
  Clock,
  TruckIcon,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { OrderStatus, SubOrder } from "@/types/order";

type Stat = {
  label: string;
  value: number;
  icon: any;
  color: string;
  status: OrderStatus | null;
};

interface SupplierOrderStatsCardsProps {
  subOrders: SubOrder[];
  activeStatus?: OrderStatus;
  onStatusFilterChange?: (status?: OrderStatus) => void;
}

export function SupplierOrderStatsCards({
  subOrders,
  activeStatus,
  onStatusFilterChange,
}: SupplierOrderStatsCardsProps) {
  const stats: Stat[] = [
    {
      label: "Total Órdenes",
      value: new Set(subOrders.map((s) => s.orderId)).size,
      icon: Package,
      color: "text-primary",
      status: null,
    },
    {
      label: "Pendientes",
      value: subOrders.filter((s) => s.status === OrderStatus.Pending).length,
      icon: Clock,
      color: "text-yellow-600",
      status: OrderStatus.Pending,
    },
    {
      label: "Procesando",
      value: subOrders.filter((s) => s.status === OrderStatus.Processing)
        .length,
      icon: Clock,
      color: "text-blue-600",
      status: OrderStatus.Processing,
    },
    {
      label: "Completadas",
      value: subOrders.filter((s) => s.status === OrderStatus.Completed).length,
      icon: CheckCircle,
      color: "text-green-600",
      status: OrderStatus.Completed,
    },
    {
      label: "Enviadas",
      value: subOrders.filter((s) => s.status === OrderStatus.Sent).length,
      icon: TruckIcon,
      color: "text-indigo-600",
      status: OrderStatus.Sent,
    },
    {
      label: "Recibidas",
      value: subOrders.filter((s) => s.status === OrderStatus.Received).length,
      icon: CheckCircle,
      color: "text-emerald-600",
      status: OrderStatus.Received,
    },
    {
      label: "Canceladas",
      value: subOrders.filter((s) => s.status === OrderStatus.Cancelled).length,
      icon: XCircle,
      color: "text-red-600",
      status: OrderStatus.Cancelled,
    },
    {
      label: "Reembolsadas",
      value: subOrders.filter((s) => s.status === OrderStatus.Refunded).length,
      icon: RotateCcw,
      color: "text-purple-600",
      status: OrderStatus.Refunded,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const isActive =
          !!onStatusFilterChange &&
          ((stat.status === null && activeStatus == null) ||
            (stat.status !== null && stat.status === activeStatus));

        const handleClick = () => {
          if (!onStatusFilterChange) return;
          onStatusFilterChange(stat.status === null ? undefined : stat.status);
        };

        return (
          <div
            key={stat.label}
            className={
              onStatusFilterChange
                ? `rounded-lg border bg-card p-6 cursor-pointer transition ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/60"
                  }`
                : "rounded-lg border bg-card p-6"
            }
            onClick={handleClick}
            role={onStatusFilterChange ? "button" : undefined}
            tabIndex={onStatusFilterChange ? 0 : undefined}
            onKeyDown={(e) => {
              if (!onStatusFilterChange) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }}
          >
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
        );
      })}
    </div>
  );
}
