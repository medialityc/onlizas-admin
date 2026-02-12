"use client";
import { useState, useMemo } from "react";
import { OrderStatus, SubOrder } from "@/types/order";
import { SubOrderItem } from "./sub-order-item";
import SimpleModal from "@/components/modal/modal";
import { Textarea } from "@/components/textarea";
import { Button } from "@/components/button/button";
import { getStatusLabel } from "@/lib/order-utils";

interface SubOrdersSectionProps {
  subOrders: SubOrder[];
  onUpdateStatus?: (
    subOrderIds: string | string[],
    status: OrderStatus,
    description: string,
  ) => void;
  isSupplier: boolean;
}

export function SubOrdersSection({
  subOrders,
  onUpdateStatus,
  isSupplier,
}: SubOrdersSectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkDescription, setBulkDescription] = useState("");

  const baseStatus = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const first = subOrders.find((s) => selectedIds.includes(s.id));
    return (first?.status as OrderStatus | undefined) ?? null;
  }, [selectedIds, subOrders]);

  const nextStatus = useMemo(() => {
    if (baseStatus === null) return null;
    switch (baseStatus) {
      case OrderStatus.Pending:
      case OrderStatus.Processing:
      case OrderStatus.Completed:
      case OrderStatus.Sent:
        return (baseStatus + 1) as OrderStatus;
      default:
        return baseStatus;
    }
  }, [baseStatus]);

  const handleToggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleOpenBulkModal = () => {
    if (!nextStatus) return;
    setBulkDescription("");
    setIsBulkModalOpen(true);
  };

  const handleConfirmBulk = () => {
    if (!onUpdateStatus || !nextStatus || selectedIds.length === 0) return;
    onUpdateStatus(selectedIds, nextStatus, bulkDescription);
    setIsBulkModalOpen(false);
    setSelectedIds([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Sub-órdenes</h3>
        {onUpdateStatus && (
          <Button
            size="sm"
            variant="primary"
            disabled={selectedIds.length === 0 || !nextStatus}
            onClick={handleOpenBulkModal}
          >
            Cambiar estado seleccionadas
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {subOrders.map((subOrder) => (
          <SubOrderItem
            key={subOrder.id}
            subOrder={subOrder}
            onUpdateStatus={onUpdateStatus}
            isSupplier={isSupplier}
            selected={selectedIds.includes(subOrder.id)}
            onToggleSelected={() => handleToggleSelected(subOrder.id)}
          />
        ))}
      </div>

      {onUpdateStatus && baseStatus !== null && nextStatus !== null && (
        <SimpleModal
          open={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title="Cambiar estado de sub-órdenes seleccionadas"
          subtitle={`${selectedIds.length} sub-orden(es) seleccionadas`}
          footer={
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                outline
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirmBulk}>
                Confirmar cambio
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Estado actual</p>
                <p>{getStatusLabel(baseStatus)}</p>
              </div>
              <div>
                <p className="font-medium">Nuevo estado</p>
                <p>{getStatusLabel(nextStatus)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Descripción del cambio</p>
              <Textarea
                value={bulkDescription}
                onChange={(e) => setBulkDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </SimpleModal>
      )}
    </div>
  );
}
