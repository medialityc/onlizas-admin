"use client";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/button/button";
import { Separator } from "@/components/ui/separator";
import { GeneralInfo } from "./general-info";
import { SubOrdersSection } from "./sub-orders-section";
import SimpleModal from "@/components/modal/modal";

interface OrderDetailsProps {
  onOpen: boolean;
  order: Order;
  onClose: () => void;
  onUpdateSubOrderStatus?: (
    subOrderIds: string | string[],
    status: OrderStatus,
    description: string,
  ) => void;
  isSupplier?: boolean;
}

export function OrderDetails({
  onOpen,
  order,
  onClose,
  onUpdateSubOrderStatus,
  isSupplier = false,
}: OrderDetailsProps) {
  const baseTrackUrl = process.env.NEXT_PUBLIC_TRACK_URL;
  const trackUrl = `${baseTrackUrl}/${order.orderNumber}`;

  return (
    <SimpleModal
      open={onOpen}
      onClose={onClose}
      title={`Detalles de Orden - ${order.orderNumber}`}
      footer={
        <div className="flex justify-between gap-2">
          {trackUrl && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                try {
                  window.open(trackUrl, "_blank", "noopener,noreferrer");
                } catch {
                  // noop
                }
              }}
            >
              Dar seguimiento
            </Button>
          )}
          <div className="flex justify-end flex-1">
            <Button type="button" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      }
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <GeneralInfo order={order} />
        <Separator />
        <div className="space-y-2 text-sm">
          <p className="font-medium">Dirección de Entrega (Destinatario)</p>
          <p className="text-muted-foreground whitespace-pre-line">
            {order.receiverAddress || "Sin dirección registrada"}
          </p>
        </div>
        <Separator />
        <SubOrdersSection
          subOrders={order.subOrders}
          onUpdateStatus={onUpdateSubOrderStatus}
          isSupplier={isSupplier}
        />
      </div>
    </SimpleModal>
  );
}
