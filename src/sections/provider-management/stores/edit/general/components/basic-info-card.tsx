"use client";

import React from "react";
import { RHFFileUpload, RHFInputWithLabel } from "@/components/react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function BasicInfoCard() {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-5 space-y-4">
      <div className="mb-2">
        <div className="flex items-center gap-3 text-gray-900">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-blue-600/10 shadow">
            <InformationCircleIcon className="w-6 h-6 text-blue-700" />
          </span>
          <div className="font-semibold text-base">Información Básica</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Nombre, descripción, URL y logo que se mostrarán a tus clientes.</p>
      </div>
      <RHFInputWithLabel name="name" label="Nombre de la Tienda" required />
      <RHFInputWithLabel name="description" label="Descripción" type="textarea" rows={2} required />
      <RHFInputWithLabel name="url" label="URL Amigable" prefix="/tienda/" required />
      <RHFFileUpload name="logoStyle" label="Cambiar Logo" placeholder="Seleccionar logo" />
    </div>
  );
}
