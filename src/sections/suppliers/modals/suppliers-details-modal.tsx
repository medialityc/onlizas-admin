"use client";

import SimpleModal from "@/components/modal/modal";
import { Supplier } from "@/types/suppliers";
import {
  TagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import {
  GlobeAltIcon,
  BriefcaseIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

interface SuppliersDetailsModalProps {
  supplier: Supplier;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function SuppliersGeneralInfo({ supplier }: { supplier: Supplier }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre del Proveedor
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {supplier.name}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <EnvelopeIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium break-all">
            {supplier.email}
          </p>
        </div>

        {typeof supplier.sellerType !== "undefined" && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BriefcaseIcon className="size-5 text-indigo-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tipo de vendedor
              </label>
            </div>
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {supplier.sellerType}
            </p>
          </div>
        )}

        {supplier.nacionality && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <GlobeAltIcon className="size-5 text-emerald-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nacionalidad
              </label>
            </div>
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {supplier.nacionality}
            </p>
          </div>
        )}

        {supplier.mincexCode && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <IdentificationIcon className="size-5 text-rose-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Código Mincex
              </label>
            </div>
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {supplier.mincexCode}
            </p>
          </div>
        )}

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {supplier.active ? (
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
              supplier.active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {supplier.active ? "Activo" : "Inactivo"}
          </span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {supplier.isAproved ? (
              <CheckCircleIcon className="size-5 text-green-500" />
            ) : (
              <XCircleIcon className="size-5 text-orange-500" />
            )}
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Aprobación
            </label>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              supplier.isAproved
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            }`}
          >
            {supplier.isAproved ? "Aprobado" : "Pendiente"}
          </span>
        </div>
      </div>
    </section>
  );
}

function SuppliersEvaluationInfo({ supplier }: { supplier: Supplier }) {
  // Validar si el rating es válido (número entre 0 y 5)
  const hasValidRating =
    typeof supplier.currentRating === "number" &&
    supplier.currentRating >= 0 &&
    supplier.currentRating <= 5 &&
    !isNaN(supplier.currentRating);

  // Validar si la fecha es válida
  const evaluationDate = supplier.lastEvaluationDate
    ? new Date(supplier.lastEvaluationDate)
    : null;
  const hasValidDate =
    evaluationDate &&
    !isNaN(evaluationDate.getTime()) &&
    evaluationDate.getFullYear() > 1900;

  // Si no hay rating válido ni fecha válida, no mostrar la sección
  if (!hasValidRating && !hasValidDate) {
    return (
      <section>
        <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
          <StarIcon className="size-6 text-primary" />
          Información de Evaluación
        </h2>
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <StarIcon className="size-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay información de evaluación disponible
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Este proveedor aún no ha sido evaluado
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <StarIcon className="size-6 text-primary" />
        Información de Evaluación
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasValidRating && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className="size-5 text-yellow-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Calificación Actual
              </label>
            </div>
          </div>
        )}

        {hasValidDate && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="size-5 text-blue-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Última Evaluación
              </label>
            </div>
            <p className="text-lg text-gray-900 dark:text-white font-medium">
              {evaluationDate!.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {evaluationDate!.toLocaleDateString("es-ES", {
                weekday: "long",
              })}
            </p>
          </div>
        )}

        {!hasValidRating && hasValidDate && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className="size-5 text-gray-400" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Calificación
              </label>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 italic">
              Sin calificación
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              No se ha asignado una calificación
            </p>
          </div>
        )}

        {hasValidRating && !hasValidDate && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="size-5 text-gray-400" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Fecha de Evaluación
              </label>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 italic">
              No disponible
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Fecha de evaluación no registrada
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function SuppliersDetailsModal({
  supplier,
  open,
  onClose,
  loading,
}: SuppliersDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles del Proveedor"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <SuppliersGeneralInfo supplier={supplier} />
        <SuppliersEvaluationInfo supplier={supplier} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
