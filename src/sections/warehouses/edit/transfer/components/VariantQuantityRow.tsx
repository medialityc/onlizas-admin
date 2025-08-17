"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function VariantQuantityRow({
  variant,
  value,
  onChange,
}: {
  variant: {
    id: number;
    name: string;
    available: number;
    storage?: string;
    color?: string;
  };
  value: number;
  onChange: (variantId: number, delta: number) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
      <div>
        <h6 className="font-medium text-gray-900 dark:text-white">
          {variant.name}
        </h6>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {variant.storage && <span>Almacenamiento: {variant.storage}</span>}
          {variant.color && (
            <span className="ml-3">Color: {variant.color}</span>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Disponible: {variant.available}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(variant.id, -1)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          disabled={!value}
        >
          <MinusIcon className="w-4 h-4" />
        </button>

        <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
          {value || 0}
        </span>

        <button
          onClick={() => onChange(variant.id, 1)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          disabled={value >= variant.available}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
