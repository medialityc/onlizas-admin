"use client";

import SimpleModal from "@/components/modal/modal";
import { Category } from "@/types/categories";
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

interface CategoriesDetailsModalProps {
  category: Category;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function CategoriesGeneralInfo({ category }: { category: Category }) {
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
            #{category.id}
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
            {category.name}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BuildingOfficeIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Departamento
            </label>
          </div>
          <div className="space-y-1">
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {category.department.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ID: #{category.department.id}
            </p>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {category.active ? (
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
              category.active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {category.active ? "Activa" : "Inactiva"}
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
            {category.description}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <PhotoIcon className="size-5 text-orange-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Imagen
            </label>
          </div>
          {category.image ? (
            <div className="space-y-2">
              <Image
                src={category.image}
                alt={category.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                {category.image}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Sin imagen
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoriesProductsInfo({ category }: { category: Category }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <CubeIcon className="size-6 text-primary" />
        Estadísticas de Productos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CubeIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Total de Productos
            </label>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {category.totalProducts}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            productos en total
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircleIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Productos Activos
            </label>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {category.activeProducts}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            productos activos
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardDocumentListIcon className="size-5 text-orange-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Con Stock
            </label>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {category.productsWithStock}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            productos con stock
          </p>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Productos Activos</span>
            <span>
              {category.totalProducts > 0
                ? Math.round(
                    (category.activeProducts / category.totalProducts) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${category.totalProducts > 0 ? (category.activeProducts / category.totalProducts) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Productos con Stock</span>
            <span>
              {category.totalProducts > 0
                ? Math.round(
                    (category.productsWithStock / category.totalProducts) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${category.totalProducts > 0 ? (category.productsWithStock / category.totalProducts) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoriesDetailsModal({
  category,
  open,
  onClose,
  loading,
}: CategoriesDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles de la Categoría"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <CategoriesGeneralInfo category={category} />
        <CategoriesProductsInfo category={category} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
