"use client";

import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { RHFTiptapEditor } from "@/components/react-hook-form";

export default function PoliciesCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-5 space-y-4">
      <div className="mb-2">
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-amber-600/10 dark:bg-amber-500/20 shadow">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
          </span>
          <div className="font-semibold text-base">Políticas de la Tienda</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Define con claridad tus políticas para generar confianza.
        </p>
      </div>

      <RHFTiptapEditor
        name="returnPolicy"
        label="Política de Devoluciones"
        required
        placeholder="Explica cómo los clientes pueden devolver productos..."
      />

      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
        <RHFTiptapEditor
          name="shippingPolicy"
          label="Política de Envíos"
          required
          placeholder="Describe los tiempos y costos de envío..."
        />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
        <RHFTiptapEditor
          name="termsOfService"
          label="Términos de Servicio"
          required
          placeholder="Establece las reglas y condiciones de tu tienda..."
        />
      </div>
    </div>
  );
}
