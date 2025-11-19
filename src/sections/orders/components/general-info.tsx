"use client";
import { Order } from "@/types/order";
import { formatCurrency, formatDate } from "@/utils/format";

interface GeneralInfoProps {
  order: Order;
}

export function GeneralInfo({ order }: GeneralInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2">Información General</h3>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Fecha:</strong> {formatDate(order.createdDatetime)}
          </p>
          <p>
            <strong>Total:</strong> {formatCurrency(order.totalAmountPaid)}
          </p>
          <p>
            <strong>Peso Total:</strong> {order.totalWeight}g
          </p>
          <p>
            <strong>Sub-órdenes:</strong> {order.subOrders.length}
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Información de Contacto</h3>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Remitente:</strong> {order.senderName}
          </p>
          <p>
            <strong>Email:</strong> {order.senderEmail}
          </p>
          <p>
            <strong>Tel:</strong> {order.senderPhone}
          </p>
        </div>
      </div>
    </div>
  );
}
