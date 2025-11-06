"use client";

import { Suspense } from "react";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { ProviderDocumentsList } from "../../../../documents/list/provider-documents-list";
import { EnhancedDocument } from "@/types/suppliers";

interface DocumentsSectionProps {
  documents: EnhancedDocument[];
  userId: string | number;
}

export function DocumentsSection({ documents, userId }: DocumentsSectionProps) {
  return (
    <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:col-span-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-violet-50 dark:bg-violet-900/10">
            <IdentificationIcon className="h-5 w-5 text-violet-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Documentos
          </h3>
        </div>
      </div>

      <Suspense fallback={<div className="py-4">Cargando documentos...</div>}>
        <ProviderDocumentsList documents={documents} userId={userId} />
      </Suspense>
    </div>
  );
}
