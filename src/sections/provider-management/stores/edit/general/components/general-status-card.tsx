"use client";

import React from "react";
import { RHFSwitch } from "@/components/react-hook-form";
import { useIsSupplierApproved } from "@/hooks/use-is-supplier-approved";

export default function GeneralStatusCard() {
  const isApproved = useIsSupplierApproved();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-base text-gray-900 dark:text-gray-100">Estado de la Tienda</span>
      </div>
      <div className="flex items-center gap-2">
        <RHFSwitch
          name="active"
          label="Tienda activa y visible para clientes"
          checkedClassName="peer-checked:bg-gradient-to-r peer-checked:from-secondary peer-checked:to-indigo-600"
          disabled={!isApproved}
          aria-disabled={!isApproved}
          helperText={
            !isApproved
              ? "No puedes activar la tienda hasta que tu cuenta sea aprobada."
              : undefined
          }
        />
      </div>
    </div>
  );
}
