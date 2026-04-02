"use client";

import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";

export default function BasicInfoCard() {
  return (
    <div className="bg-white border rounded-lg shadow-lg p-5 space-y-4">
      <div className="mb-2">
        <div className="flex items-center gap-3 text-gray-900">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-blue-600/10 shadow">
            <InformationCircleIcon className="w-6 h-6 text-blue-700" />
          </span>
          <div className="font-semibold text-base">Información General</div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Datos básicos y de contacto de la tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RHFInputWithLabel name="name" label="Nombre de la Tienda" required />
        <RHFInputWithLabel
          name="email"
          label="Email de Contacto"
          type="email"
          required
        />
        <RHFInputWithLabel
          name="url"
          label="URL Amigable"
          prefix="/tienda/"
          required
        />
        <RHFInputWithLabel
          name="phoneNumber"
          label="Teléfono de Contacto"
          type="tel"
          placeholder="+123456789"
        />
      </div>

      <RHFInputWithLabel
        name="description"
        label="Descripción"
        type="textarea"
        rows={2}
        required
      />
      <RHFInputWithLabel
        name="address"
        label="Dirección"
        type="textarea"
        rows={2}
      />

      <RHFImageUpload
        variant="rounded"
        size="full"
        name="logoStyle"
        label="Cambiar Logo"
      />
    </div>
  );
}
