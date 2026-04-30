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
import { useState, useCallback } from "react";
import Image from "next/image";
import { Order, OrderStatus, SubOrder } from "@/types/order";
import { Card, CardContent, CardHeader } from "@/components/cards/card";
import { formatCurrency, formatDate } from "@/utils/format";
import { Button } from "@/components/button/button";
import Badge from "@/components/badge/badge"; // legacy badge (mantener si se usa en otro lugar)
import { StatusBadge } from "@/components/orders/status-badge";
import { getStatusLabel } from "@/lib/order-utils";
import { CountdownTimer } from "@/components/orders/countdown-timer";
import { Eye, Download, Tag } from "lucide-react";
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
  const [exportingAllLabels, setExportingAllLabels] = useState(false);
  const [exportingLabel, setExportingLabel] = useState<string | null>(null);

  const handleAllLabels = useCallback(async () => {
    setExportingAllLabels(true);
    try {
      const { exportSubOrderLabelPdf } = await import("../utils/exporters");
      for (const subOrder of order.subOrders) {
        await exportSubOrderLabelPdf(order, subOrder);
      }
    } finally {
      setExportingAllLabels(false);
    }
  }, [order]);

  const handleOneLabel = useCallback(
    async (subOrder: SubOrder) => {
      setExportingLabel(subOrder.id);
      try {
        const { exportSubOrderLabelPdf } = await import("../utils/exporters");
        await exportSubOrderLabelPdf(order, subOrder);
      } finally {
        setExportingLabel(null);
      }
    },
    [order],
  );

  const weightLabel = (w: number) => {
    if (w >= 1000) {
      return `${(w / 1000).toFixed(2)} kg`;
    }
    return `${w} g`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow pt-0">
      <CardHeader className="bg-muted/50 py-3">
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
              {order.configuredTime > 0 && (
                <CountdownTimer
                  createdDatetime={order.createdDatetime}
                  configuredMinutes={order.configuredTime}
                />
              )}
              {/* Datos básicos */}
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Peso Total:
                  </span>{" "}
                  {weightLabel(order.totalWeight)}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Impuesto Total:
                  </span>{" "}
                  {formatCurrency(order.totalTaxAmount, "USD")}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Envio Total:
                  </span>{" "}
                  {formatCurrency(order.totalDeliveryAmount, "USD")}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Monto Total (USD):
                  </span>{" "}
                  {formatCurrency(order.totalAmountPaid, "USD")}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(order.totalAmountPaid, "USD")}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={exportingAllLabels}
              onClick={handleAllLabels}
              title="Descargar etiquetas de todas las sub-órdenes"
            >
              <Tag className="h-4 w-4 mr-1" />
              {exportingAllLabels ? "Generando..." : "Etiquetas"}
            </Button>
            <Button size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
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
                <p className="font-medium text-gray-900 dark:text-gray-100">Remitente: {order.senderName}</p>
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
                <p className="font-medium text-gray-900 dark:text-gray-100">
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
            <span>
              Envío: {formatCurrency(order.totalDeliveryAmount, "USD")}
            </span>
          </div>
        </div>

          {isExpanded && (
          <div className="mt-4 space-y-3 pt-4 border-t dark:border-gray-700">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              Sub-órdenes:
            </h4>
            {order.subOrders.map((subOrder) => {
              return (
                <div
                  key={subOrder.id}
                  className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#232830]"
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
                      <p className="font-medium truncate text-gray-900 dark:text-gray-100">
                        {subOrder.productName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Nº: {subOrder.subOrderNumber}
                      </p>
                      {isAdmin && subOrder.storeName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tienda: {subOrder.storeName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] flex-1 text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Cant:</span>{" "}
                      {subOrder.requestedQuantity}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Pagado:</span>{" "}
                      {formatCurrency(subOrder.amountPaid, "USD")}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Impuesto:</span>{" "}
                      {formatCurrency(subOrder.taxAmount, "USD")}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Envío:</span>{" "}
                      {formatCurrency(subOrder.deliveryAmount, "USD")}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Peso:</span>{" "}
                      {weightLabel(subOrder.weight)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Fecha:</span>{" "}
                      {formatDate(subOrder.createdDatetime)}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 w-full md:w-auto">
                    <StatusBadge status={subOrder.status as OrderStatus} />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={exportingLabel === subOrder.id}
                        onClick={() => handleOneLabel(subOrder)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {exportingLabel === subOrder.id ? "..." : "Etiqueta"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
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
                              "noopener,noreferrer",
                            );
                          } catch {}
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Ver factura
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
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
                              suggestedName,
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
