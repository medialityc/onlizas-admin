"use client";

import SimpleModal from "@/components/modal/modal";
import { useQuery } from "@tanstack/react-query";
import { getStaticPageBySlug } from "@/services/static-pages";
import { StaticPageDto, StaticPageSummaryDto } from "@/types/static-pages";
import PreviewPanel from "@/components/html-text-editor/preview-panel";
import type { PreviewDevice } from "@/components/html-text-editor/types";
import { useState } from "react";

interface StaticPageDetailsModalProps {
  pageId: string;
  open: boolean;
  onClose: () => void;
  fallbackPage?: StaticPageSummaryDto | null;
}

export function StaticPageDetailsModal({
  pageId,
  open,
  onClose,
  fallbackPage,
}: StaticPageDetailsModalProps) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");

  // For details we might not have slug in list item; this modal expects a slug to retrieve public page.
  // If slug is not present in fallbackPage, you may adjust to fetch by id via a dedicated service.
  const slug = fallbackPage?.slug || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug no disponible");
      const res = await getStaticPageBySlug(slug);
      if (res.error || !res.data) throw new Error(res.message || "Error");
      return res.data as StaticPageDto;
    },
    enabled: open && !!slug,
  });

  return (
    <SimpleModal
      title="Detalles de la Página"
      className="max-w-7xl max-h-[95vh]"
      open={open}
      onClose={onClose}
    >
      <div className="space-y-4 p-1">
        {isLoading && !data && (
          <p className="text-sm text-gray-500">Cargando...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">
            No se pudieron cargar los detalles.
          </p>
        )}
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Título
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.title}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Slug
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  /{data.slug}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <PreviewPanel
                htmlContent={data.content}
                previewDevice={device}
                onDeviceChange={setDevice}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
