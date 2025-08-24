"use client";

import { InventoryItem } from "@/types/inventory";

interface InventoryVariantsTabProps {
  item: InventoryItem;
}

export default function InventoryVariantsTab({
  item,
}: InventoryVariantsTabProps) {
  return (
    <div className="space-y-4">
      {item.variants.map((v, idx) => (
        <div key={idx} className="rounded-2xl border p-5">
          <h5 className="text-lg font-semibold">
            {v.name} {v.value}
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
            <div>
              <div className="text-gray-500">SKU</div>
              <div className="font-medium">
                {item.productName.slice(0, 3).toUpperCase()}-{idx + 1}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Cantidad</div>
              <div className="font-medium">{v.units}</div>
            </div>
            <div>
              <div className="text-gray-500">Precio</div>
              <div className="font-medium">$1.299,99</div>
            </div>
            <div>
              <div className="text-gray-500">Valor Total</div>
              <div className="font-medium">$32.499,75</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-500">Características</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full border text-xs">
                {v.name}: {v.value}
              </span>
              <span className="px-2 py-1 rounded-full border text-xs">
                Unidades: {v.units}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
