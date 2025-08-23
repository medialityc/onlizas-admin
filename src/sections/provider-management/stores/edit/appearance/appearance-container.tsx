"use client";

import React from "react";
import { Store } from "@/types/stores";
import AppearanceTabs from "./components/appearance-tabs";

interface Props { store: Store }

export default function AppearanceContainer({ store }: Props) {
  return (
    <div className="p-6">
      <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-5">
        <div className="mb-2">
          <h2 className="text-base font-semibold text-gray-900">Apariencia</h2>
          <p className="text-sm text-gray-500">Tema, colores y banners para: {store?.name}</p>
        </div>
        <div className="border-t border-gray-100 pt-4 min-h-16">
          <AppearanceTabs />
        </div>
      </div>
    </div>
  );
}
