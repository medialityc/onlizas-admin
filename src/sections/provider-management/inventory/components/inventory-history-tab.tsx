"use client";

import { useMemo } from "react";

interface HistoryItem {
  id: number;
  type: string;
  date: string;
  description: string;
  badgeClass: string;
}

export default function InventoryHistoryTab() {
  const history = useMemo<HistoryItem[]>(
    () => [
      {
        id: 1,
        type: "Entrada",
        date: "2024-01-15",
        description: "Se agregaron 50 unidades",
        badgeClass: "bg-gray-900 text-white",
      },
      {
        id: 2,
        type: "Salida",
        date: "2024-01-14",
        description: "Se vendieron 5 unidades",
        badgeClass: "bg-gray-200 text-gray-800",
      },
      {
        id: 3,
        type: "Entrada",
        date: "2024-01-10",
        description: "Recepción de nueva mercancía",
        badgeClass: "bg-gray-900 text-white",
      },
      {
        id: 4,
        type: "Salida",
        date: "2024-01-08",
        description: "Transferencia a otro almacén",
        badgeClass: "bg-gray-200 text-gray-800",
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5">
        <h4 className="text-lg font-semibold mb-4">Historial de Movimientos</h4>
        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <div>
                <div className="font-semibold">
                  {h.type === "Entrada" ? "Entrada de inventario" : "Venta"}
                </div>
                <div className="text-sm text-gray-500">{h.description}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-700">{h.date}</div>
                <span className={`text-xs px-2 py-1 rounded ${h.badgeClass}`}>
                  {h.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
