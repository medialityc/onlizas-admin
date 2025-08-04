"use client";

import SimpleModal from "@/components/modal/modal";
import { Units } from "@/types/units";
import {
  TagIcon,
  DocumentTextIcon,
  HashtagIcon,
} from "@heroicons/react/24/solid";

interface UnitsDetailsModalProps {
  unit: Units;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function UnitsGeneralInfo({ unit }: { unit: Units }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {unit.name}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Abreviación
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            {unit.abbreviation}
          </p>
        </div>
      </div>
    </section>
  );
}

export function UnitsDetailsModal({
  unit,
  open,
  onClose,
  loading,
}: UnitsDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles de la Unidad"
      loading={loading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6">
        <UnitsGeneralInfo unit={unit} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
