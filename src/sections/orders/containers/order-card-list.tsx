import React, { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Order, OrderStatus } from "@/types/order";
import { OrderCard } from "../components/order-card";
import { OrderDetails } from "../components/order-details";
import showToast from "@/config/toast/toastConfig";
import { updateSubOrderStatus } from "@/services/order";

type Props = {
  data?: Order[];
};

const OrderList = ({ data }: Props) => {
  const id = useId();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const router = useRouter();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
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
        orderCode: selectedOrder.id,
        parcelCodes: subOrders.map((so) => so.id),
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
      {data && data.length > 0 ? (
        <section className="grid grid-cols-1 gap-3 md:gap-6 mb-4">
          {data?.map((order: Order, idx) => (
            <div className="col-span-1" key={`${id}-${order?.id}${idx}`}>
              <OrderCard
                order={order}
                isAdmin
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            No se encontraron órdenes
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros o la búsqueda para ver resultados
          </p>
        </div>
      )}
      {selectedOrder && (
        <OrderDetails
          onOpen={true}
          order={selectedOrder}
          onClose={handleCloseDetails}
          onUpdateSubOrderStatus={handleUpdateSubOrderStatus}
          isSupplier={false}
        />
      )}
    </>
  );
};

export default OrderList;
