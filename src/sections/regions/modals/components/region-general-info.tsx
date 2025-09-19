"use client";

import { Region } from "@/types/regions";
import {
  TagIcon,
  DocumentTextIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

export function RegionGeneralInfo({ region }: { region: Region }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-6">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Código */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Código
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            {region.code}
          </p>
        </div>

        {/* Nombre */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {region.name}
          </p>
        </div>

        {/* Estado */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Estado
            </label>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            region.status === 0
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : region.status === 1
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {region.status === 0 ? 'Activa' :
             region.status === 1 ? 'Inactiva' : 'Eliminada'}
          </span>
        </div>

        {/* Fecha de creación */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="size-5 text-orange-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Creada
            </label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(region.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Descripción */}
      {region.description && (
        <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {region.description}
          </p>
        </div>
      )}
    </section>
  );
}

export default RegionGeneralInfo;
