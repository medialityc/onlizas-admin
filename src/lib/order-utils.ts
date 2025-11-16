import { OrderStatus } from "@/types/order";

export function formatCurrency(value: number, currency: string = "USD") {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return "Pendiente";
    case OrderStatus.Processing:
      return "Procesando";
    case OrderStatus.Completed:
      return "Completada";
    case OrderStatus.Sent:
      return "Enviada";
    case OrderStatus.Received:
      return "Recibida";
    case OrderStatus.Cancelled:
      return "Cancelada";
    case OrderStatus.Refunded:
      return "Reembolsada";
    default:
      return "Desconocido";
  }
}

export function statusToColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Pending:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.Processing:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.Completed:
      return "bg-green-100 text-green-800";
    case OrderStatus.Sent:
      return "bg-indigo-100 text-indigo-800";
    case OrderStatus.Received:
      return "bg-emerald-100 text-emerald-800";
    case OrderStatus.Cancelled:
      return "bg-red-100 text-red-800";
    case OrderStatus.Refunded:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
