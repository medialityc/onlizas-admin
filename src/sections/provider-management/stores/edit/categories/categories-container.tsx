"use client";

import React from "react";
import { Store } from "@/types/stores";

interface Props { store: Store }

export default function CategoriesContainer({ store }: Props) {
  return (
    <div className="p-6">
      <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-5">
        <div className="mb-2">
          <h2 className="text-base font-semibold text-gray-900">Categorías</h2>
          <p className="text-xs text-gray-500">Gestión y ordenamiento de categorías para: {store?.name}</p>
        </div>
        <div className="border-t border-gray-100 pt-4 min-h-16">
          {/* TODO: Implement draggable categories list and modals */}
        </div>
      </div>
    </div>
  );
}
