"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/types/fetch/api";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/button/button";
import { Separator } from "@/components/ui/separator";
import { GeneralInfo } from "./general-info";
import { SubOrdersSection } from "./sub-orders-section";
import SimpleModal from "@/components/modal/modal";
import { getOrderById, updateSubOrderStatus } from "@/services/order";
import showToast from "@/config/toast/toastConfig";
import { CountdownTimer } from "@/components/orders/countdown-timer";

interface OrderDetailsProps {
  onOpen: boolean;
  orderId: string;
  onClose: () => void;
  isSupplier?: boolean;
}

export function OrderDetails({
  onOpen,
  orderId,
  onClose,
  isSupplier = false,
}: OrderDetailsProps) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessingLocked, setIsProcessingLocked] = useState(false);

  const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<Order>>(
    {
      queryKey: ["order-details", orderId],
      queryFn: () => getOrderById(orderId),
      enabled: onOpen,
    },
  );

  const order = data?.data;

  const baseTrackUrl = process.env.NEXT_PUBLIC_TRACK_URL;
  const trackUrl = order ? `${baseTrackUrl}/${order.orderNumber}` : undefined;

  // Lock to prevent moving sub-orders from Pending -> Processing
  useEffect(() => {
    if (!order || !order.configuredTime || order.configuredTime <= 0) {
      setIsProcessingLocked(false);
      return;
    }

    const createdMs = new Date(order.createdDatetime).getTime();
    const targetMs = createdMs + order.configuredTime * 60 * 1000;

    const updateLock = () => {
      const remaining = targetMs - Date.now();
      setIsProcessingLocked(remaining > 0);
    };

    updateLock();
    const interval = setInterval(updateLock, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const handleUpdateSubOrderStatus = async (
    subOrderIds: string | string[],
    status: OrderStatus,
    description: string,
  ) => {
    if (!order) return;

    const ids = Array.isArray(subOrderIds) ? subOrderIds : [subOrderIds];
    const subOrders = order.subOrders.filter((so) => ids.includes(so.id));

    if (subOrders.length !== ids.length) {
      showToast(
        "No se encontraron todas las sub-órdenes seleccionadas",
        "error",
      );
      return;
    }

    const currentStatus = subOrders[0].status as OrderStatus;
    const allSameStatus = subOrders.every(
      (so) => (so.status as OrderStatus) === currentStatus,
    );

    if (!allSameStatus) {
      showToast(
        "Todas las sub-órdenes seleccionadas deben tener el mismo estado actual",
        "error",
      );
      return;
    }

    if (status === currentStatus) {
      showToast("Las sub-órdenes ya se encuentran en este estado", "info");
      return;
    }

    const allowedNext =
      currentStatus === OrderStatus.Pending ||
      currentStatus === OrderStatus.Processing ||
      currentStatus === OrderStatus.Completed ||
      currentStatus === OrderStatus.Sent
        ? currentStatus + 1
        : currentStatus;

    if (status !== allowedNext) {
      showToast(
        "Solo se puede avanzar al siguiente estado de la sub-orden",
        "error",
      );
      return;
    }

    // Enforce configured waiting time before allowing Pending -> Processing
    if (
      order.configuredTime > 0 &&
      currentStatus === OrderStatus.Pending &&
      status === OrderStatus.Processing
    ) {
      const createdMs = new Date(order.createdDatetime).getTime();
      const targetMs = createdMs + order.configuredTime * 60 * 1000;
      const now = Date.now();
      if (now < targetMs) {
        const remainingMinutes = Math.ceil((targetMs - now) / (60 * 1000));
        showToast(
          `Aún no puedes procesar la orden. Tiempo restante aproximado: ${remainingMinutes} minuto(s).`,
          "error",
        );
        return;
      }
    }

    try {
      setIsUpdating(true);
      const res = await updateSubOrderStatus({
        orderCode: order.id,
        parcelCodes: subOrders.map((so) => so.id),
        state: status,
        description,
      });

      if (res.error && res.message) {
        showToast(res.message, "error");
        return;
      }

      showToast("Estado de las sub-órdenes actualizado", "success");
      // Revalidar detalles de la orden y cualquier lista asociada
      await refetch();
      await queryClient.invalidateQueries({ queryKey: ["orders-list"] });
    } catch (e) {
      console.error(e);
      showToast("Ocurrió un error al actualizar el estado", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SimpleModal
      open={onOpen}
      onClose={onClose}
      size="lg"
      title={
        order
          ? `Detalles de Orden - ${order.orderNumber}`
          : "Cargando detalles de la orden..."
      }
      footer={
        <div className="flex justify-between gap-2">
          {trackUrl && (
            <Button
              variant="secondary"
              type="button"
              disabled={isLoading || isUpdating}
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
            <Button type="button" onClick={onClose} disabled={isUpdating}>
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div className="relative min-h-[200px] space-y-6">
        {(isLoading || !order) && (
          <div className="flex h-48 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 h-8 w-8" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cargando detalles de la orden...
              </p>
            </div>
          </div>
        )}

        {order && (
          <>
            <GeneralInfo order={order} />
            {order.configuredTime > 0 && (
              <CountdownTimer
                createdDatetime={order.createdDatetime}
                configuredMinutes={order.configuredTime}
              />
            )}
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
              onUpdateStatus={handleUpdateSubOrderStatus}
              isSupplier={isSupplier}
              isProcessingLocked={isProcessingLocked}
            />
          </>
        )}

        {isUpdating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/50">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 h-8 w-8" />
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Actualizando estado de la orden...
              </p>
            </div>
          </div>
        )}
      </div>
    </SimpleModal>
  );
}
