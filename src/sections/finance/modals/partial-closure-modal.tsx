"use client";
import React from "react";
import { z } from "zod";
import { GeneratePartialClosureSchema } from "../schemas";

interface PartialClosureModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof GeneratePartialClosureSchema>) => void;
}

export function PartialClosureModal({
  open,
  onClose,
  onSubmit,
}: PartialClosureModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded shadow p-4 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-3">Generar cierre parcial</h3>
        <div className="space-y-2 text-sm text-gray-600">
          Formulario pendiente de integración
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded border" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-3 py-2 rounded bg-black text-white"
            onClick={() =>
              onSubmit({
                fromDate: "",
                toDate: "",
                suppliers: [],
                amountBySupplier: {},
              })
            }
          >
            Generar
          </button>
        </div>
      </div>
    </div>
  );
}
