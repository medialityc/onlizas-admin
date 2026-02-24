import { Card, CardContent } from "@/components/cards/card";
import { Order, OrderStatus } from "@/types/order";
import { Package, Clock, CheckCircle, TruckIcon } from "lucide-react";

interface OrderStatsProps {
  orders: Order[];
  activeStatus?: OrderStatus;
  onStatusFilterChange?: (status?: OrderStatus) => void;
}

type Stat = {
  label: string;
  value: number;
  icon: any;
  color: string;
  status: OrderStatus | null;
};

export function OrderStats({
  orders,
  activeStatus,
  onStatusFilterChange,
}: OrderStatsProps) {
  const allSubOrders = orders.flatMap((order) => order.subOrders);

  const stats: Stat[] = [
    {
      label: "Total Órdenes",
      value: orders.length,
      icon: Package,
      color: "text-primary",
      status: null,
    },
    {
      label: "Pendientes",
      value: allSubOrders.filter((so) => so.status === OrderStatus.Pending)
        .length,
      icon: Clock,
      color: "text-yellow-600",
      status: OrderStatus.Pending,
    },
    {
      label: "En Proceso",
      value: allSubOrders.filter(
        (so) =>
          so.status === OrderStatus.Processing ||
          so.status === OrderStatus.Sent,
      ).length,
      icon: TruckIcon,
      color: "text-blue-600",
      // Usamos Processing como valor de filtro representativo del grupo
      status: OrderStatus.Processing,
    },
    {
      label: "Completadas",
      value: allSubOrders.filter(
        (so) =>
          so.status === OrderStatus.Completed ||
          so.status === OrderStatus.Received,
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
      status: OrderStatus.Completed,
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
          <Card
            key={stat.label}
            className={
              onStatusFilterChange
                ? `cursor-pointer transition border ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/60"
                  }`
                : undefined
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
