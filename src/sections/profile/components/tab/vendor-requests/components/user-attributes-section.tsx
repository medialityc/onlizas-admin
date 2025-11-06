"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/cards/card";
import {
  CalendarIcon,
  UserIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { SupplierApprovalProcess } from "@/types/suppliers";

interface UserAttributesSectionProps {
  approvalProcess: SupplierApprovalProcess | null;
}

// Función para formatear fechas correctamente
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "No especificada";

  try {
    // Si viene con formato ISO (2025-08-31T04:00:00Z), extraer solo la fecha
    const dateOnly = dateString.includes("T")
      ? dateString.split("T")[0]
      : dateString;

    // Crear fecha local evitando problemas de zona horaria
    const [year, month, day] = dateOnly.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Formatear en español
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formateando fecha:", dateString, error);
    return "Fecha inválida";
  }
};

export function UserAttributesSection({
  approvalProcess,
}: UserAttributesSectionProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="dark:text-white flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <span>Información del Vendedor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <CalendarIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Fecha de Expiración
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                {formatDate(approvalProcess?.expirationDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <UserIcon className="h-6 w-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Tipo de Vendedor
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                {approvalProcess?.sellerType || "No especificado"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <GlobeAltIcon className="h-6 w-6 text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Alcance de Mercado
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                {approvalProcess?.nacionality || "No especificado"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <DocumentTextIcon className="h-6 w-6 text-orange-500 dark:text-orange-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Código MINCEX
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                {approvalProcess?.mincexCode || "No especificado"}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <MapPinIcon className="h-6 w-6 text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                País
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                {approvalProcess?.countryName || "No especificado"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
