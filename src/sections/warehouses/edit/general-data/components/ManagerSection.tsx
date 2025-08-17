"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import RHFInput from "@/components/react-hook-form/rhf-input";

export default function ManagerSection() {
  return (
    <section className="rounded-lg border border-gray-100 dark:border-gray-700 p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <UserCircleIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Responsable del almacén
          </h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Datos de contacto del gestor.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <RHFInput
          name="managerName"
          label="Nombre del Gestor"
          placeholder="Ej: Carlos Rodríguez"
        />
        <RHFInput
          name="managerEmail"
          label="Email del Gestor"
          type="email"
          placeholder="gestor@empresa.com"
          autoComplete="email"
        />
        <RHFInput
          name="managerPhone"
          label="Teléfono del Gestor"
          type="tel"
          placeholder="(201) 555-0123"
          autoComplete="tel"
        />
      </div>
    </section>
  );
}
