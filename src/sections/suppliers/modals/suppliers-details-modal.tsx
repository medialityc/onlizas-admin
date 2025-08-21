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
            <TagIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ID del Proveedor
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            #{supplier.id}
          </p>
        </div>

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
            {supplier.isActive ? (
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
              supplier.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {supplier.isActive ? "Activo" : "Inactivo"}
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
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {supplier.currentRating.toFixed(1)}
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`size-5 ${
                      star <= supplier.currentRating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              de 5.0 estrellas
            </p>
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

      {hasValidRating && (
        <>
          {/* Barra de calificación visual */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Nivel de Calificación</span>
              <span>{((supplier.currentRating / 5) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  supplier.currentRating >= 4.5
                    ? "bg-green-500"
                    : supplier.currentRating >= 3.5
                      ? "bg-yellow-500"
                      : supplier.currentRating >= 2.5
                        ? "bg-orange-500"
                        : "bg-red-500"
                }`}
                style={{
                  width: `${(supplier.currentRating / 5) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Deficiente</span>
              <span>Excelente</span>
            </div>
          </div>

          {/* Indicador de rendimiento */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nivel de Rendimiento
            </h3>
            <p
              className={`text-lg font-medium ${
                supplier.currentRating >= 4.5
                  ? "text-green-600 dark:text-green-400"
                  : supplier.currentRating >= 3.5
                    ? "text-yellow-600 dark:text-yellow-400"
                    : supplier.currentRating >= 2.5
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-red-600 dark:text-red-400"
              }`}
            >
              {supplier.currentRating >= 4.5
                ? "Excelente"
                : supplier.currentRating >= 3.5
                  ? "Bueno"
                  : supplier.currentRating >= 2.5
                    ? "Regular"
                    : "Deficiente"}
            </p>
          </div>
        </>
      )}
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
