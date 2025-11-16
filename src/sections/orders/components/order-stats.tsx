import { Card, CardContent } from "@/components/cards/card";
import { Order, OrderStatus } from "@/types/order";
import { Package, Clock, CheckCircle, TruckIcon } from "lucide-react";

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const allSubOrders = orders.flatMap((order) => order.subOrders);

  const stats = [
    {
      label: "Total Órdenes",
      value: orders.length,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Pendientes",
      value: allSubOrders.filter((so) => so.status === OrderStatus.Pending)
        .length,
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "En Proceso",
      value: allSubOrders.filter(
        (so) =>
          so.status === OrderStatus.Processing || so.status === OrderStatus.Sent
      ).length,
      icon: TruckIcon,
      color: "text-blue-600",
    },
    {
      label: "Completadas",
      value: allSubOrders.filter(
        (so) =>
          so.status === OrderStatus.Completed ||
          so.status === OrderStatus.Received
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
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
      ))}
    </div>
  );
}
