"use client";

import React from "react";
import { RHFSwitch } from "@/components/react-hook-form";

export default function GeneralStatusCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-base text-gray-900 dark:text-gray-100">Estado de la Tienda</span>
      </div>
      <div className="flex items-center gap-2">
        <RHFSwitch
          name="isActive"
          label="Tienda activa y visible para clientes"
          checkedClassName="peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600"
        />
      </div>
    </div>
  );
}
