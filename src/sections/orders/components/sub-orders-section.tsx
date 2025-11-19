"use client";
import { OrderStatus, SubOrder } from "@/types/order";
import { SubOrderItem } from "./sub-order-item";

interface SubOrdersSectionProps {
  subOrders: SubOrder[];
  onUpdateStatus?: (subOrderId: string, status: OrderStatus) => void;
  isSupplier: boolean;
}

export function SubOrdersSection({
  subOrders,
  onUpdateStatus,
  isSupplier,
}: SubOrdersSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4">Sub-órdenes</h3>
      <div className="space-y-4">
        {subOrders.map((subOrder) => (
          <SubOrderItem
            key={subOrder.id}
            subOrder={subOrder}
            onUpdateStatus={onUpdateStatus}
            isSupplier={isSupplier}
          />
        ))}
      </div>
    </div>
  );
}
