"use client";

import SimpleModal from "@/components/modal/modal";
import { Business } from "@/types/business";
import Image from "next/image";
import {
  TagIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";

interface BusinessDetailsModalProps {
  business: Business;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function BusinessGeneralInfo({ business }: { business: Business }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ID de la Categoría
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            #{business.id}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre de la Categoría
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {business.name}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BuildingOfficeIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Departamento
            </label>
          </div>
          {/* <div className="space-y-1">
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {category.department.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: #{category.department.id}
            </p>
          </div> */}
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {business.isPrimary ? (
              <CheckCircleIcon className="size-5 text-green-500" />
            ) : (
              <XCircleIcon className="size-5 text-red-500" />
            )}
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Estado
            </label>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              business.isPrimary
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {business.isPrimary ? "Activa" : "Inactiva"}
          </span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="size-5 text-indigo-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Descripción
            </label>
          </div>
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
            {business.description}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <PhotoIcon className="size-5 text-orange-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Imagen
            </label>
          </div>
          {business.photos && business.photos[0] ? (
            <div className="space-y-2">
              <Image
                src={business.photos[0]}
                alt={business.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                {business.photos}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md">
              <PhotoIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function BusinessDetailsModal({
  business,
  open,
  onClose,
  loading,
}: BusinessDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles de la Categoría"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <BusinessGeneralInfo business={business} />
        {/* <CategoriesProductsInfo business={business} /> */}

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
