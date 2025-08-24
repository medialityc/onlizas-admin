"use client";

import React from "react";
import VariantQuantityRow from "./VariantQuantityRow";

export default function TransferItemCard({
  item,
  selectedQuantities,
  onChange,
  onAdd,
  isAdded,
}: {
  item: {
    id: number;
    productName: string;
    category: string;
    supplier: string;
    variants: Array<{
      id: number;
      name: string;
      available: number;
      storage?: string;
      color?: string;
    }>;
  };
  selectedQuantities: Record<number, number>;
  onChange: (variantId: number, delta: number) => void;
  onAdd: (itemId: number) => void;
  isAdded?: boolean;
}) {
  const totalSelected = Object.entries(selectedQuantities)
    .filter(([vid]) => item.variants.some((v) => v.id === Number(vid)))
    .reduce((sum, [, qty]) => sum + (qty || 0), 0);

  const handleFillAll = () => {
    for (const v of item.variants) {
      const current = selectedQuantities[v.id] || 0;
      const delta = Math.max(0, v.available - current);
      if (delta > 0) onChange(v.id, delta);
    }
  };

  const handleClearAll = () => {
    for (const v of item.variants) {
      const current = selectedQuantities[v.id] || 0;
      if (current > 0) onChange(v.id, -current);
    }
  };

  const allAtMax = item.variants.every(
    (v) => (selectedQuantities[v.id] || 0) >= v.available
  );
  const allAtZero = item.variants.every(
    (v) => (selectedQuantities[v.id] || 0) === 0
  );

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {item.productName}
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {item.category} - {item.supplier}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            Sel.: <span className="font-medium">{totalSelected}</span>
          </div>
          <button
            type="button"
            aria-label={
              isAdded
                ? "Agregado a la transferencia"
                : "Agregar a la transferencia"
            }
            onClick={() => onAdd(item.id)}
            disabled={totalSelected === 0 || isAdded}
            title={
              isAdded
                ? "Ya agregado a la transferencia"
                : "Agregar este producto a la transferencia"
            }
            className="p-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            {isAdded ? (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            aria-label="Asignar el máximo disponible a todas las variantes"
            onClick={handleFillAll}
            title="Asignar el máximo disponible a todas las variantes"
            className="p-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            disabled={allAtMax}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 20l7-7 7 7"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Poner en cero todas las variantes"
            onClick={handleClearAll}
            title="Poner en cero todas las variantes"
            className="p-1.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            disabled={allAtZero}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {item.variants.map((variant) => (
          <VariantQuantityRow
            key={variant.id}
            variant={variant}
            value={selectedQuantities[variant.id] || 0}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
