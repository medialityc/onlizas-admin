"use client";

import React from "react";
import { RHFTinyMCEEditor } from "@/components/react-hook-form";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function PoliciesCardTinyMCE() {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg dark:shadow-none p-5 space-y-4">
      <div className="mb-2">
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-amber-600/10 dark:bg-amber-500/10 shadow">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-700 dark:text-amber-400" />
          </span>
          <div className="font-semibold text-base">Políticas de la Tienda</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Define con claridad tus políticas para generar confianza.
        </p>
      </div>

      <RHFTinyMCEEditor
        name="returnPolicy"
        label="Política de Devoluciones"
        placeholder="Describe tu política de devoluciones..."
        required
        height={200}
      />

      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
        <RHFTinyMCEEditor
          name="shippingPolicy"
          label="Política de Envíos"
          placeholder="Describe tu política de envíos..."
          required
          height={200}
        />
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
        <RHFTinyMCEEditor
          name="termsOfService"
          label="Términos de Servicio"
          placeholder="Describe tus términos de servicio..."
          required
          height={200}
        />
      </div>
    </div>
  );
}
