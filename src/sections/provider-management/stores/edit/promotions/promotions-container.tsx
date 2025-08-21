"use client";

import React from "react";
import { Store } from "@/types/stores";

interface Props { store: Store }

export default function PromotionsContainer({ store }: Props) {
  return (
    <div className="p-6">
      <div className="panel">
        <h2 className="text-xl font-semibold">Promociones</h2>
        <p className="text-sm text-gray-500">Gestión de promociones y reglas para: {store?.name}</p>
        {/* TODO: Implement promotions list and create modal */}
      </div>
    </div>
  );
}
