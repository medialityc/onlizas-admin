"use client";
import { useState, useCallback } from "react";
import { OrderStatus, SubOrder } from "@/types/order";
import { Card } from "@/components/cards/card";
import { Button } from "@/components/button/button";
import { Eye, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusLabel } from "@/lib/order-utils";
import { formatCurrency, formatDate } from "@/utils/format";
import Badge from "@/components/badge/badge";
import { urlToFile } from "@/lib/utils";

interface SubOrderItemProps {
  subOrder: SubOrder;
  onUpdateStatus?: (subOrderId: string, status: OrderStatus) => void;
  isSupplier: boolean;
}

export function SubOrderItem({
  subOrder,
  onUpdateStatus,
  isSupplier,
}: SubOrderItemProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    subOrder.status as OrderStatus
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      const newStatus = parseInt(value) as OrderStatus;
      setSelectedStatus(newStatus);
      onUpdateStatus?.(subOrder.id, newStatus);
    },
    [onUpdateStatus, subOrder.id]
  );

  const hasFacture = !!subOrder.factureUrl && subOrder.factureUrl.trim() !== "";

  const handleViewFacture = useCallback(() => {
    if (!hasFacture) return;
    try {
      window.open(subOrder.factureUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      // noop
    }
  }, [hasFacture, subOrder.factureUrl]);

  const handleDownloadFacture = useCallback(async () => {
    if (!hasFacture) return;
    try {
      const suggestedName = `factura-${subOrder.subOrderNumber || subOrder.id}`;
      const file = await urlToFile(subOrder.factureUrl, suggestedName);
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // noop
    }
  }, [hasFacture, subOrder.factureUrl, subOrder.subOrderNumber, subOrder.id]);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{subOrder.productName}</h4>
            <Badge variant="outline-primary">{subOrder.subOrderNumber}</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <p>
              <strong>Cantidad:</strong> {subOrder.requestedQuantity}
            </p>
            <p>
              <strong>Peso:</strong> {subOrder.weight}g
            </p>
            <p>
              <strong>Monto:</strong> {formatCurrency(subOrder.amountPaid)}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(subOrder.createdDatetime)}
            </p>
          </div>
          {isSupplier && subOrder.storeName && (
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Tienda:</strong> {subOrder.storeName}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Select
            value={selectedStatus.toString()}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(OrderStatus)
                .filter((v) => typeof v === "number")
                .map((status) => (
                  <SelectItem key={status} value={status.toString()}>
                    {getStatusLabel(status as OrderStatus)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              outline
              disabled={!hasFacture}
              onClick={handleViewFacture}
            >
              <Eye className="h-4 w-4 mr-1" /> Ver factura
            </Button>
            <Button
              size="sm"
              variant="secondary"
              outline
              disabled={!hasFacture}
              onClick={handleDownloadFacture}
            >
              <Download className="h-4 w-4 mr-1" /> Descargar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
