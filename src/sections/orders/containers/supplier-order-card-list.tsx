import React, { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Order, OrderStatus } from "@/types/order";
import { OrderGroupCard } from "@/components/orders/order-group-card";
import { OrderDetails } from "../components/order-details";
import showToast from "@/config/toast/toastConfig";
import { updateSubOrderStatus } from "@/services/order";

type Props = {
  data?: Order[];
  onPrintLabel?: (subOrderId: string, status: any) => void;
};

const SupplierOrderCardList = ({ data, onPrintLabel }: Props) => {
  const id = useId();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDetailsModal = () => {
    setDetailModalOpen(true);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    handleDetailsModal();
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleUpdateSubOrderStatus = async (
    subOrderIds: string | string[],
    status: OrderStatus,
    description: string,
  ) => {
    if (!selectedOrder) return;

    const ids = Array.isArray(subOrderIds) ? subOrderIds : [subOrderIds];
    const subOrders = selectedOrder.subOrders.filter((so) =>
      ids.includes(so.id),
    );

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

    try {
      const res = await updateSubOrderStatus({
        orderCode: selectedOrder.orderNumber,
        parcelCodes: subOrders.map((so) => so.subOrderNumber),
        state: status,
        description,
      });

      if (res.error && res.message) {
        showToast(res.message, "error");
        return;
      }

      showToast("Estado de las sub-órdenes actualizado", "success");
      await queryClient.invalidateQueries({ queryKey: ["orders-list"] });
    } catch (e) {
      console.error(e);
      showToast("Ocurrió un error al actualizar el estado", "error");
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:gap-6 mb-4">
        {data?.map((order: Order, idx) => (
          <div className="col-span-1" key={`${id}-${order?.id}${idx}`}>
            <OrderGroupCard
              order={order}
              onPrintLabel={onPrintLabel}
              onViewDetails={handleViewDetails}
            />
          </div>
        ))}
      </section>
      {selectedOrder && (
        <OrderDetails
          onOpen={detailModalOpen}
          order={selectedOrder}
          onClose={handleCloseDetails}
          onUpdateSubOrderStatus={handleUpdateSubOrderStatus}
          isSupplier={true}
        />
      )}
    </>
  );
};

export default SupplierOrderCardList;
