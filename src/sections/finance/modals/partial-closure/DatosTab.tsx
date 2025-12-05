"use client";
import React from "react";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { RHFInputWithLabel } from "@/components/react-hook-form";

export function DatosTab({
  fromDate,
  toDate,
  onContinue,
}: {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <RHFDateInput name="fromDate" label="Fecha inicio" maxDate={toDate} />
        <RHFDateInput
          name="toDate"
          label="Fecha fin"
          minDate={fromDate}
          maxDate={(() => {
            const d = new Date();
            d.setDate(d.getDate() - 15);
            return d;
          })()}
        />
      </div>
      <RHFInputWithLabel name="notes" label="Notas" type="textarea" />
      <div className="flex items-center justify-end">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90"
          onClick={onContinue}
        >
          Continuar a Proveedores
        </button>
      </div>
    </div>
  );
}
