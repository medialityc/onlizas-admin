"use client";
import { OrderStatus } from "@/types/order";
import { statusToColor, getStatusLabel } from "@/lib/order-utils";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-xs font-medium",
        statusToColor(status)
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
