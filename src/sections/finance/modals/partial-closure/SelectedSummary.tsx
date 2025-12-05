"use client";
import React from "react";
import { SelectedAccount } from "./types";

export function SelectedSummary({
  selectedAccounts,
  computeTotalAmount,
  onClear,
  onGoSuppliers,
}: {
  selectedAccounts: SelectedAccount[];
  computeTotalAmount: () => number;
  onClear: () => void;
  onGoSuppliers: () => void;
}) {
  return (
    <div className=" bg-white/95 dark:bg-[#0b1422]/95 backdrop-blur pt-2 pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="text-sm flex items-center gap-2">
          {Array.isArray(selectedAccounts) && selectedAccounts.length > 0 ? (
            <>
              <span className="text-gray-700">Total a pagar</span>
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 text-xs">
                {selectedAccounts.length} cuenta(s)
              </span>
            </>
          ) : (
            <span className="text-gray-500">
              Selecciona cuentas para ver el resumen
            </span>
          )}
        </div>
        <div className="text-sm font-semibold">
          {Array.isArray(selectedAccounts) && selectedAccounts.length > 0
            ? computeTotalAmount().toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })
            : "—"}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs"
          onClick={onClear}
        >
          Limpiar selección
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs"
          onClick={onGoSuppliers}
        >
          Ir a proveedores
        </button>
      </div>
    </div>
  );
}
