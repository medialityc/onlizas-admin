"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/cards/card";
import { Button } from "@/components/button/button";
import {
  DocumentTextIcon,
  FolderIcon,
  CalendarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface VendorRequestFormProps {
  categoryModalOpen: boolean;
  setCategoryModalOpen: (open: boolean) => void;
  expirationModalOpen: boolean;
  setExpirationModalOpen: (open: boolean) => void;
}

export function VendorRequestForm({
  categoryModalOpen,
  setCategoryModalOpen,
  expirationModalOpen,
  setExpirationModalOpen,
}: VendorRequestFormProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="dark:text-white flex items-center space-x-2">
          <DocumentTextIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <span>Solicitudes de Aprobación</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            📝 Puede solicitar autorización para nuevas categorías o extender la
            fecha de expiración de su autorización actual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Solicitar Categorías */}
          <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center space-x-3 mb-4">
              <FolderIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Solicitar Categorías
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pida autorización para vender en nuevas categorías
                </p>
              </div>
            </div>
            <Button
              onClick={() => setCategoryModalOpen(true)}
              className="w-full py-2 px-4 rounded-lg font-medium shadow-none border-none transition-colors duration-200 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Solicitar Categorías</span>
            </Button>
          </div>

          {/* Extender Fecha */}
          <div className="border border-green-200 dark:border-green-800 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Extender Fecha
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Solicite una extensión de la fecha de expiración
                </p>
              </div>
            </div>
            <Button
              onClick={() => setExpirationModalOpen(true)}
              className="w-full py-2 px-4 rounded-lg shadow-none border-none font-medium transition-colors duration-200 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Extender Fecha</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
