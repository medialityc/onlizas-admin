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
import SimpleModal from "@/components/modal/modal";
import { Textarea } from "@/components/textarea";

interface SubOrderItemProps {
  subOrder: SubOrder;
  onUpdateStatus?: (
    subOrderIds: string | string[],
    status: OrderStatus,
    description: string,
  ) => void;
  isSupplier: boolean;
  selected: boolean;
  onToggleSelected: () => void;
}

const getNextAllowedStatuses = (current: OrderStatus): OrderStatus[] => {
  switch (current) {
    case OrderStatus.Pending:
    case OrderStatus.Processing:
    case OrderStatus.Completed:
    case OrderStatus.Sent:
      return [current, (current + 1) as OrderStatus];
    case OrderStatus.Received:
    case OrderStatus.Cancelled:
    case OrderStatus.Refunded:
    default:
      return [current];
  }
};

const getStatusDefaultDescription = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Pending:
      return "La sub-orden ha sido creada y está pendiente de procesamiento.";
    case OrderStatus.Processing:
      return "La sub-orden está siendo preparada por el proveedor.";
    case OrderStatus.Completed:
      return "La sub-orden ha sido preparada y está lista para el envío.";
    case OrderStatus.Sent:
      return "La sub-orden ha sido enviada al cliente.";
    case OrderStatus.Received:
      return "La sub-orden ha sido entregada y recibida por el cliente.";
    case OrderStatus.Cancelled:
      return "La sub-orden ha sido cancelada.";
    case OrderStatus.Refunded:
      return "La sub-orden ha sido reembolsada.";
    default:
      return "";
  }
};

export function SubOrderItem({
  subOrder,
  onUpdateStatus,
  isSupplier,
  selected,
  onToggleSelected,
}: SubOrderItemProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    subOrder.status as OrderStatus,
  );
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = useCallback(
    (value: string) => {
      const newStatus = parseInt(value) as OrderStatus;

      if (newStatus === selectedStatus) return;

      setPendingStatus(newStatus);
      setDescription(getStatusDefaultDescription(newStatus));
      setIsModalOpen(true);
    },
    [selectedStatus],
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
    <>
      <Card className="p-4 md:p-5 rounded-2xl border border-border/70 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all bg-gradient-to-br from-background via-background to-muted/40">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                checked={selected}
                onChange={onToggleSelected}
              />

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold leading-tight truncate text-foreground">
                    {subOrder.productName}
                  </h4>
                  <Badge
                    variant="outline-primary"
                    className="text-[11px] px-1.5 py-0.5"
                  >
                    Nº {subOrder.subOrderNumber}
                  </Badge>
                </div>
                {isSupplier && subOrder.storeName && (
                  <p className="text-xs text-muted-foreground truncate">
                    Tienda:{" "}
                    <span className="font-medium text-foreground">
                      {subOrder.storeName}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
              <span className="hidden text-xs text-muted-foreground md:inline-block">
                Estado actual
              </span>
              <Badge variant="primary" className="px-3 py-1 text-xs shadow-sm">
                {getStatusLabel(selectedStatus)}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between">
            {/* Left: info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="flex flex-col rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Cantidad
                  </span>
                  <span className="mt-1 text-sm font-semibold text-foreground">
                    {subOrder.requestedQuantity}
                  </span>
                </div>
                <div className="flex flex-col rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Peso
                  </span>
                  <span className="mt-1 text-sm font-semibold text-foreground">
                    {subOrder.weight}g
                  </span>
                </div>
                <div className="flex flex-col rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Monto
                  </span>
                  <span className="mt-1 text-sm font-semibold text-foreground">
                    {formatCurrency(subOrder.amountPaid)}
                  </span>
                </div>
                <div className="flex flex-col rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Fecha
                  </span>
                  <span className="mt-1 text-sm font-semibold text-foreground">
                    {formatDate(subOrder.createdDatetime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex flex-col md:w-72 gap-4 border-t pt-4 md:border-t-0 md:border-l md:border-border/60 md:pl-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground md:text-right">
                  Cambiar estado
                </p>
                <Select
                  value={selectedStatus.toString()}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full h-9 text-sm justify-between">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNextAllowedStatuses(selectedStatus).map((status) => (
                      <SelectItem key={status} value={status.toString()}>
                        {getStatusLabel(status as OrderStatus)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground md:text-right">
                  Factura
                </p>
                <div className="flex flex-wrap justify-start md:justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    outline
                    disabled={!hasFacture}
                    onClick={handleViewFacture}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    outline
                    disabled={!hasFacture}
                    onClick={handleDownloadFacture}
                    className="gap-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Descargar</span>
                  </Button>
                  {!hasFacture && (
                    <span className="text-[11px] text-muted-foreground">
                      No disponible
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <SimpleModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPendingStatus(null);
        }}
        title="Cambiar estado de sub-orden"
        subtitle={`Nº ${subOrder.subOrderNumber} - ${subOrder.productName}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              outline
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setPendingStatus(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!pendingStatus) return;
                onUpdateStatus?.(subOrder.id, pendingStatus, description);
                setSelectedStatus(pendingStatus);
                setPendingStatus(null);
                setIsModalOpen(false);
              }}
            >
              Confirmar cambio
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Estado actual</p>
              <p>{getStatusLabel(selectedStatus)}</p>
            </div>
            {pendingStatus !== null && (
              <div>
                <p className="font-medium">Nuevo estado</p>
                <p>{getStatusLabel(pendingStatus)}</p>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Descripción del cambio</p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </SimpleModal>
    </>
  );
}
