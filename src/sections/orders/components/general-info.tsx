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
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Información General
        </h3>
        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Fecha:</span>{" "}
            {formatDate(order.createdDatetime)}
          </p>
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>{" "}
            {formatCurrency(order.totalAmountPaid, "USD")}
          </p>
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Peso Total:</span>{" "}
            {order.totalWeight}g
          </p>
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Sub-órdenes:</span>{" "}
            {order.subOrders.length}
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Información de Contacto
        </h3>
        <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Remitente:</span>{" "}
            {order.senderName}
          </p>
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Email:</span>{" "}
            {order.senderEmail}
          </p>
          <p>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Tel:</span>{" "}
            {order.senderPhone}
          </p>
        </div>
      </div>
    </div>
  );
}
