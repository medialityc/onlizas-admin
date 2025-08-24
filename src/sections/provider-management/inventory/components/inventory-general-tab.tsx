"use client";

import { InventoryItem } from "@/types/inventory";
import {
  BuildingStorefrontIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface InventoryGeneralTabProps {
  item: InventoryItem;
}

export default function InventoryGeneralTab({
  item,
}: InventoryGeneralTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información del Producto */}
        <div className="rounded-2xl border p-5">
          <h4 className="text-lg font-semibold mb-3">
            Información del Producto
          </h4>
          <div className="flex gap-3">
            <div className="h-16 w-16 rounded-md bg-gray-100" />
            <div>
              <div className="font-semibold leading-tight">
                {item.productName}
              </div>
              <div className="text-sm text-gray-500">
                {item.productCategory}
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Descripción
            <div className="text-gray-500">
              Laptop de alto rendimiento para gaming
            </div>
          </div>
        </div>

        {/* Ubicación y Estado */}
        <div className="rounded-2xl border p-5">
          <h4 className="text-lg font-semibold mb-3">Ubicación y Estado</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <BuildingStorefrontIcon className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Tienda</span>
              <span className="text-gray-700">{item.storeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArchiveBoxIcon className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Almacén</span>
              <span className="text-gray-700">{item.warehouseName}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <span className="font-medium">Estado</span>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.status === "En Stock"
                    ? "bg-green-100 text-green-800"
                    : item.status === "Stock Bajo"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-600" />
              <span className="font-medium">Última Actualización</span>
              <span className="text-gray-700">2024-01-15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="rounded-2xl border p-5">
        <h4 className="text-lg font-semibold mb-4">Resumen de Inventario</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{item.quantity}</div>
            <div className="text-sm text-gray-500">Cantidad Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              ${formatCurrency(item.totalValue)}
            </div>
            <div className="text-sm text-gray-500">Valor Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{item.variants.length}</div>
            <div className="text-sm text-gray-500">Variantes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
