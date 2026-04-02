"use client";

import React from "react";
import { RHFTiptapEditor } from "@/components/react-hook-form";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function PoliciesCard() {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-5 space-y-4">
      <div className="mb-2">
        <div className="flex items-center gap-3 text-gray-900">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-amber-600/10 shadow">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-700" />
          </span>
          <div className="font-semibold text-base">Políticas de la Tienda</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Define con claridad tus políticas para generar confianza.
        </p>
      </div>
      <RHFTiptapEditor
        name="returnPolicy"
        label="Política de Devoluciones"
        required
      />
      <div className="border-t border-gray-100 pt-4">
        <RHFTiptapEditor
          name="shippingPolicy"
          label="Política de Envíos"
          required
        />
      </div>
      <div className="border-t border-gray-100 pt-4">
        <RHFTiptapEditor
          name="termsOfService"
          label="Términos de Servicio"
          required
        />
      </div>
    </div>
  );
}
