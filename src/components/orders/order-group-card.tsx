"use client";
import { useState } from "react";
import { Package, Clock } from "lucide-react";
import Image from "next/image";
import { Order, SubOrder, OrderStatus } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib/order-utils";
import { StatusBadge } from "@/components/orders/status-badge";
import { Button } from "@/components/button/button";

export type OrderGroup = { order: Order; subOrders: SubOrder[] };

export function OrderGroupCard({
  group,
  onPrintLabel,
}: {
  group: OrderGroup;
  onPrintLabel?: (subOrderId: string, status: OrderStatus) => void;
}) {
  const { order, subOrders } = group;
  const [expanded, setExpanded] = useState(true);
  const orderTotal = subOrders.reduce((sum, so) => sum + so.amountPaid, 0);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div
        className="bg-muted/50 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
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
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {subOrders.length} producto(s)
            </p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(orderTotal)}
            </p>
          </div>
          <Button
            variant="secondary"
            outline
            size="sm"
            aria-label={expanded ? "Contraer" : "Expandir"}
          >
            {expanded ? "−" : "+"}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pt-4 pb-6 space-y-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="text-sm font-medium mb-2">Información de Envío</p>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente</p>
                <p className="font-medium">{order.senderName}</p>
                {order.senderEmail && (
                  <p className="text-muted-foreground">{order.senderEmail}</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Destinatario</p>
                <p className="font-medium">{order.receiverName}</p>
                <p className="text-muted-foreground">{order.receiverAddress}</p>
                {order.receiverPhone && (
                  <p className="text-muted-foreground">
                    Tel: {order.receiverPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {subOrders.map((so) => (
              <div
                key={so.id}
                className="p-4 rounded-lg border bg-card space-y-3"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <Image
                    src={so.image || "/placeholder.svg"}
                    alt={so.productName}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-semibold">{so.productName}</h5>
                        <p className="text-sm text-muted-foreground">
                          {so.subOrderNumber}
                        </p>
                      </div>
                      <StatusBadge status={so.status as OrderStatus} />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cantidad</p>
                        <p className="font-semibold">
                          {so.requestedQuantity} und
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Peso</p>
                        <p className="font-semibold">{so.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monto</p>
                        <p className="font-semibold text-primary">
                          {formatCurrency(so.amountPaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Envío</p>
                        <p className="font-semibold">
                          {formatCurrency(so.deliveryAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        outline
                        size="sm"
                        onClick={() =>
                          onPrintLabel &&
                          onPrintLabel(so.id, so.status as OrderStatus)
                        }
                      >
                        Imprimir Etiqueta
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}