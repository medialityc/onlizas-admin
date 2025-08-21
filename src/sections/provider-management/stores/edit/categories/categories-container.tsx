"use client";

import React from "react";
import { Store } from "@/types/stores";

interface Props { store: Store }

export default function CategoriesContainer({ store }: Props) {
  return (
    <div className="p-6">
      <div className="panel">
        <h2 className="text-xl font-semibold">Categorías</h2>
        <p className="text-sm text-gray-500">Gestión y ordenamiento de categorías para: {store?.name}</p>
        {/* TODO: Implement draggable categories list and modals */}
      </div>
    </div>
  );
}
