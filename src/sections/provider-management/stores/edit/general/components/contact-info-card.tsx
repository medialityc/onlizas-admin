"use client";

import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { PhoneIcon } from "@heroicons/react/24/outline";

export default function ContactInfoCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-5 space-y-4">
      <div className="mb-2">
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-emerald-600/10 dark:bg-emerald-500/20 shadow">
            <PhoneIcon className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
          </span>
          <div className="font-semibold text-base">Información de Contacto</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Datos para consultas y soporte al cliente.</p>
      </div>
      <RHFInputWithLabel name="email" label="Email de Contacto" type="email" required />
      <RHFInputWithLabel name="phoneNumber" label="Teléfono de Contacto" type="tel" placeholder="+123456789" />
      <RHFInputWithLabel name="address" label="Dirección" type="textarea" rows={2} />
    </div>
  );
}
