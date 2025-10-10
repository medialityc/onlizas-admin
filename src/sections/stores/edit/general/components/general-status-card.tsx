"use client";

import React from "react";
import { RHFSwitch } from "@/components/react-hook-form";

export default function GeneralStatusCard() {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-base text-gray-900">Estado de la Tienda</span>
      </div>
      <div className="flex items-center gap-2">
        <RHFSwitch
          name="active"
          label="Tienda activa y visible para clientes"
          checkedClassName="peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600"
        />
      </div>
    </div>
  );
}
