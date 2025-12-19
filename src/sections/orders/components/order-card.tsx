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
import { Order, OrderStatus } from "@/types/order";
import { Card, CardContent, CardHeader } from "@/components/cards/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/button/button";
import Badge from "@/components/badge/badge"; // legacy badge (mantener si se usa en otro lugar)
import { StatusBadge } from "@/components/orders/status-badge";
import { getStatusLabel } from "@/lib/order-utils";
import { CountdownTimer } from "@/components/orders/countdown-timer";
import { Eye, Download } from "lucide-react";
import { urlToFile } from "@/lib/utils";

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
  // configuredTime ahora se interpreta como MINUTOS

  const weightLabel = (w: number) => {
    if (w >= 1000) {
      return `${(w / 1000).toFixed(2)} kg`;
    }
    return `${w} g`;
  };

  // lógica de cronómetro movida a CountdownTimer

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50 pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {order.orderNumber}
                {typeof order.status !== "undefined" && (
                  <StatusBadge status={order.status as OrderStatus} />
                )}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(order.createdDatetime)}
              </p>
              {/* {order.configuredTime > 0 && (
                <CountdownTimer
                  createdDatetime={order.createdDatetime}
                  configuredMinutes={order.configuredTime}
                />
              )} */}
              {/* Datos básicos */}
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">
                    Peso Total:
                  </span>{" "}
                  {weightLabel(order.totalWeight)}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Impuesto Total:
                  </span>{" "}
                  {formatCurrency(order.totalTaxAmount)}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Envio Total:
                  </span>{" "}
                  {formatCurrency(order.totalDeliveryAmount)}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Monto Total:
                  </span>{" "}
                  {formatCurrency(order.totalAmountPaid)}
                </div>
              </div>
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
            <Button
              size="sm"
              variant="secondary"
              outline
              onClick={() => onViewDetails(order)}
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">Remitente: {order.senderName}</p>
                {order.senderEmail && (
                  <p className="text-muted-foreground break-all">
                    Email: {order.senderEmail}
                  </p>
                )}
                {order.senderPhone && (
                  <p className="text-muted-foreground">
                    Tel: {order.senderPhone}
                  </p>
                )}
                {order.senderAddress && (
                  <p className="text-muted-foreground">
                    Dirección: {order.senderAddress}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  Destinatario: {order.receiverName}
                </p>
                {order.receiverEmail && (
                  <p className="text-muted-foreground break-all">
                    Email: {order.receiverEmail}
                  </p>
                )}
                {order.receiverPhone && (
                  <p className="text-muted-foreground">
                    Tel: {order.receiverPhone}
                  </p>
                )}
                {order.receiverAddress && (
                  <p className="text-muted-foreground">
                    Dirección: {order.receiverAddress}
                  </p>
                )}
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
            {order.subOrders.map((subOrder) => {
              return (
                <div
                  key={subOrder.id}
                  className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Image
                      src={subOrder.image || "/placeholder.svg"}
                      alt={subOrder.productName}
                      width={60}
                      height={60}
                      className="rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {subOrder.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Nº: {subOrder.subOrderNumber}
                      </p>
                      {isAdmin && subOrder.storeName && (
                        <p className="text-xs text-muted-foreground">
                          Tienda: {subOrder.storeName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] flex-1">
                    <div>
                      <span className="font-medium">Cant:</span>{" "}
                      {subOrder.requestedQuantity}
                    </div>
                    <div>
                      <span className="font-medium">Pagado:</span>{" "}
                      {formatCurrency(subOrder.amountPaid)}
                    </div>
                    <div>
                      <span className="font-medium">Impuesto:</span>{" "}
                      {formatCurrency(subOrder.taxAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Envío:</span>{" "}
                      {formatCurrency(subOrder.deliveryAmount)}
                    </div>
                    <div>
                      <span className="font-medium">Peso:</span>{" "}
                      {weightLabel(subOrder.weight)}
                    </div>
                    <div>
                      <span className="font-medium">Fecha:</span>{" "}
                      {formatDate(subOrder.createdDatetime)}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 w-full md:w-auto">
                    <StatusBadge status={subOrder.status as OrderStatus} />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        outline
                        disabled={
                          !subOrder.factureUrl ||
                          subOrder.factureUrl.trim() === ""
                        }
                        onClick={() => {
                          if (!subOrder.factureUrl) return;
                          try {
                            window.open(
                              subOrder.factureUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          } catch {}
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Ver factura
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        outline
                        disabled={
                          !subOrder.factureUrl ||
                          subOrder.factureUrl.trim() === ""
                        }
                        onClick={async () => {
                          if (!subOrder.factureUrl) return;
                          try {
                            const suggestedName = `factura-${subOrder.subOrderNumber || subOrder.id}`;
                            const file = await urlToFile(
                              subOrder.factureUrl,
                              suggestedName
                            );
                            const url = URL.createObjectURL(file);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = file.name;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(url);
                          } catch {}
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" /> Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
