"use client";

import React from "react";
import { Store } from "@/types/stores";

interface Props { store: Store }

export default function AppearanceContainer({ store }: Props) {
  return (
    <div className="p-6">
      <div className="panel">
        <h2 className="text-xl font-semibold">Apariencia</h2>
        <p className="text-sm text-gray-500">Tema, colores y banners para: {store?.name}</p>
        {/* TODO: Implement subtabs for Theme & Colors / Banners / Preview */}
      </div>
    </div>
  );
}
