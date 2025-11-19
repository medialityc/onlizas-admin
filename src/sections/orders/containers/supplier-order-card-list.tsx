import React, { useId, useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { OrderGroupCard } from "@/components/orders/order-group-card";
import { OrderDetails } from "../components/order-details";

type Props = {
  data?: Order[];
  onPrintLabel?: (subOrderId: string, status: any) => void;
};

const SupplierOrderCardList = ({ data, onPrintLabel }: Props) => {
  const id = useId();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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

  const handleUpdateSubOrderStatus = (
    subOrderId: string,
    status: OrderStatus
  ) => {
    // TODO: Implementar actualización de estado de sub-orden
    console.log("Update sub-order status", subOrderId, status);
  };

  const handleUpdateAddress = (
    type: "sender" | "receiver",
    address: string
  ) => {
    // TODO: Implementar actualización de dirección
    console.log("Update address", type, address);
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
          onUpdateAddress={handleUpdateAddress}
          isSupplier={true}
        />
      )}
    </>
  );
};

export default SupplierOrderCardList;
