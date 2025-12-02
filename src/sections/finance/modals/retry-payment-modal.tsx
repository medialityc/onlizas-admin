"use client";
import React from "react";

interface RetryPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: (accountId: string) => void;
  accountId?: string;
}

export function RetryPaymentModal({
  open,
  onClose,
  onRetry,
  accountId,
}: RetryPaymentModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded shadow p-4 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Reintentar pago</h3>
        <p className="text-sm text-gray-600">
          ¿Deseas reintentar el pago de la cuenta {accountId ?? ""}?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded border" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-3 py-2 rounded bg-black text-white"
            onClick={() => onRetry(accountId ?? "")}
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  );
}
