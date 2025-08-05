"use client";

import SimpleModal from "@/components/modal/modal";
import { Currency } from "@/services/currencies";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  GlobeAltIcon,
  ScaleIcon,
} from "@heroicons/react/24/solid";

interface CurrencyDetailsModalProps {
  currency: Currency;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function CurrencyGeneralInfo({ currency }: { currency: Currency }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyDollarIcon className="size-5 text-blue-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              ID de la Moneda
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            #{currency.id}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre de la Moneda
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {currency.name}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <GlobeAltIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Código ISO
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            {currency.codIso}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ScaleIcon className="size-5 text-orange-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tasa de Cambio
            </label>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {currency.rate.toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {currency.isActive ? (
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
              currency.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {currency.isActive ? "Activa" : "Inactiva"}
          </span>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            {currency.default ? (
              <CheckCircleIcon className="size-5 text-yellow-500" />
            ) : (
              <XCircleIcon className="size-5 text-gray-500" />
            )}
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Moneda por Defecto
            </label>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currency.default
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {currency.default ? "Sí" : "No"}
          </span>
        </div>
      </div>
    </section>
  );
}

function CurrencyUsageInfo({ currency }: { currency: Currency }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <ClipboardDocumentListIcon className="size-6 text-primary" />
        Información de Uso
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ScaleIcon className="size-5 text-blue-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tasa de Conversión
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              1 {currency.codIso} = {currency.rate} unidades de moneda base
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Esta tasa se utiliza para convertir entre {currency.name} y la
                moneda base del sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CurrencyDollarIcon className="size-5 text-green-500" />
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Estado del Sistema
              </label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estado:
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currency.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {currency.isActive ? "Activa" : "Inactiva"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Por defecto:
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currency.default
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {currency.default ? "Sí" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {currency.default && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Moneda por Defecto
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Esta es la moneda principal del sistema. Se utiliza como
                referencia para todas las conversiones y cálculos de precios en
                la aplicación.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function CurrenciesDetailsModal({
  currency,
  open,
  onClose,
  loading,
}: CurrencyDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles de la Moneda"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <CurrencyGeneralInfo currency={currency} />
        <CurrencyUsageInfo currency={currency} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
