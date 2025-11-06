"use client";

import { ImageOff, Info, X } from "lucide-react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

// Definición de la interfaz de Categoría
export interface CategoryDetails {
  id: number;
  name: string;
  isActive: boolean;
  departmentId: number;
  departmentName: string;
  description: string;
  image: string;
  features: string[];
}

export function CategoryDetailsModal({
  category,
  isOpen,
  onClose,
}: {
  category: CategoryDetails | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Info className="h-5 w-5 text-blue-500 mr-2" />
            Detalles de Categoría
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagen */}
            <div className="w-full md:w-1/3">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden h-48 flex items-center justify-center shadow-inner">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-4 text-center">
                    <ImageOff className="w-12 h-12 mb-2" />
                    <p className="text-sm">Sin imagen</p>
                  </div>
                )}
              </div>
            </div>

            {/* Detalles */}
            <div className="w-full md:w-2/3">
              <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                {category.name}
              </h4>

              <div className="space-y-4">
                {/* Estado */}
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-32">
                    Estado:
                  </span>
                  <span className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {category.isActive ? "Activa" : "Inactiva"}
                    </span>
                  </span>
                </div>

                {/* Departamento */}
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-32">
                    Departamento:
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {category.departmentName || "No especificado"}
                  </span>
                </div>

                {/* Descripción */}
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">
                    Descripción:
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    {category.description || "Sin descripción"}
                  </p>
                </div>

                {/* Características */}
                {category.features && category.features.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2">
                      Características:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.features.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg text-xs text-blue-700 dark:text-blue-300 flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-1.5 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
