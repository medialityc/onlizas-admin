"use client";

import SimpleModal from "@/components/modal/modal";
import { Department } from "@/types/departments";
import Image from "next/image";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface DetailsModalProps {
  department: Department;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function DepartmentGeneralInfo({ department }: { department: Department }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BuildingOfficeIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ID del Departamento
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            #{department.id}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre del Departamento
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {department.name}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Descripción
            </label>
          </div>
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
            {department.description}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <PhotoIcon className="size-5 text-indigo-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Imagen
            </label>
          </div>
          {department.image ? (
            <>
              <Image
                src={department.image}
                alt={department.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Sin imagen
            </p>
          )}
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {department.isActive ? (
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
              department.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {department.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
    </section>
  );
}

function DepartmentStatsInfo({ department }: { department: Department }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <ClipboardDocumentListIcon className="size-6 text-primary" />
        Estadísticas y Permisos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Categorías
            </label>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {department.categoriesCount}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            categorías asociadas
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {department.canEdit ? (
              <CheckCircleIcon className="size-5 text-green-500" />
            ) : (
              <XCircleIcon className="size-5 text-red-500" />
            )}
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Edición
            </label>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              department.canEdit
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {department.canEdit ? "Permitida" : "Bloqueada"}
          </span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {department.canDelete ? (
              <CheckCircleIcon className="size-5 text-green-500" />
            ) : (
              <XCircleIcon className="size-5 text-red-500" />
            )}
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Eliminación
            </label>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              department.canDelete
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {department.canDelete ? "Permitida" : "Bloqueada"}
          </span>
        </div>
      </div>
    </section>
  );
}

export function DepartmentDetailsModal({
  department,
  open,
  onClose,
  loading,
}: DetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles del Departamento"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <DepartmentGeneralInfo department={department} />
        <DepartmentStatsInfo department={department} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
