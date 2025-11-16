"use client";

import {
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  Clock,
  DollarSign,
  User,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader } from "@/components/cards/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/button/button";
import Badge from "@/components/badge/badge";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  isAdmin?: boolean;
}

export function OrderCard({
  order,
  onViewDetails,
  isAdmin = true,
}: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(order.createdDatetime)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(order.totalAmountPaid)}
            </span>
            <Button size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Cliente: {order.senderName}</p>
                {order.senderEmail && (
                  <p className="text-muted-foreground">{order.senderEmail}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Destino: {order.receiverName}</p>
                <p className="text-muted-foreground">{order.receiverAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{order.subOrders.length} sub-orden(es)</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Envío: {formatCurrency(order.totalDeliveryAmount)}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm">Sub-órdenes:</h4>
            {order.subOrders.map((subOrder) => (
              <div
                key={subOrder.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <Image
                  src={subOrder.image || "/placeholder.svg"}
                  alt={subOrder.productName}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{subOrder.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {subOrder.subOrderNumber}
                  </p>
                  {isAdmin && subOrder.storeName && (
                    <p className="text-xs text-muted-foreground">
                      Proveedor: {subOrder.storeName}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <Badge>{subOrder.status}</Badge>
                  <p className="text-sm font-semibold">
                    {formatCurrency(subOrder.amountPaid)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cant: {subOrder.requestedQuantity}
                  </p>
                </div>
              </div>
            ))}

            <Button
              onClick={() => onViewDetails(order)}
              className="w-full mt-3"
            >
              Ver detalles completos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
