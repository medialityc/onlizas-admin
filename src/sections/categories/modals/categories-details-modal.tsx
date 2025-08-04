"use client";

import SimpleModal from "@/components/modal/modal";
import { Categorie } from "@/types/categories";
import {
  BookOpenIcon,
  DocumentTextIcon,
  HashtagIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

interface CategoriesDetailsModalProps {
  category: Categorie;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

function CategoriesGeneralInfo({ category }: { category: Categorie }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <DocumentTextIcon className="size-6 text-primary" />
        Información General
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">        
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenIcon className="size-5 text-green-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Capítulo
            </label>
          </div>
          <p className="text-lg font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded inline-block">
            {category.chapter}
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <DocumentTextIcon className="size-5 text-purple-500" />
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nombre del Capítulo
            </label>
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {category.chapterName}
          </p>
        </div>
      </div>
    </section>
  );
}

function CategoriesRuleInfo({ category }: { category: Categorie }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
        <ClipboardDocumentListIcon className="size-6 text-primary" />
        Regla Específica
      </h2>
      <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
            {category.specificRule}
          </p>
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
        <CategoriesRuleInfo category={category} />

        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
