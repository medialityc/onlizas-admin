import React, { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/types/order";
import { OrderGroupCard } from "@/components/orders/order-group-card";
import { OrderDetails } from "../components/order-details";
import showToast from "@/config/toast/toastConfig";

type Props = {
  data?: Order[];
  onPrintLabel?: (subOrderId: string, status: any) => void;
};

const SupplierOrderCardList = ({ data, onPrintLabel }: Props) => {
  const id = useId();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const router = useRouter();

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
          orderId={selectedOrder.id}
          onClose={handleCloseDetails}
          isSupplier={true}
        />
      )}
    </>
  );
};

export default SupplierOrderCardList;
