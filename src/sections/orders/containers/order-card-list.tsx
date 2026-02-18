import React, { useEffect, useId, useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { OrderCard } from "../components/order-card";
import { OrderDetails } from "../components/order-details";
import showToast from "@/config/toast/toastConfig";

type Props = {
  data?: Order[];
};

const OrderList = ({ data }: Props) => {
  const id = useId();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(data ?? []);

  useEffect(() => {
    setOrders(data ?? []);
  }, [data]);

  const handleDetailsModal = () => {
    setDetailModalOpen(true);
  };
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    handleDetailsModal();
  };

  const handleCloseDetails = () => {
    setDetailModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      {data && data.length > 0 ? (
        <section className="grid grid-cols-1 gap-3 md:gap-6 mb-4">
          {orders.map((order: Order, idx) => (
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
          onOpen={detailModalOpen}
          orderId={selectedOrder.id}
          onClose={handleCloseDetails}
          isSupplier={false}
          onSubOrdersUpdated={(orderId, updates) => {
            setOrders((prev) =>
              prev.map((order) => {
                if (order.id !== orderId) return order;
                return {
                  ...order,
                  subOrders: order.subOrders.map((so) => {
                    const match = updates.find((u) => u.id === so.id);
                    return match ? { ...so, status: match.status } : so;
                  }),
                };
              }),
            );
          }}
        />
      )}
    </>
  );
};

export default OrderList;
