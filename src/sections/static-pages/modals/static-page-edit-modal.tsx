"use client";

import SimpleModal from "@/components/modal/modal";
import StaticPageForm from "../components/static-page-form";
import { StaticPageFormData } from "../schemas/static-page-schema";
import { useQuery } from "@tanstack/react-query";
import { getStaticPageByIdAdmin } from "@/services/static-pages";

interface StaticPageEditModalProps {
  open: boolean;
  onClose: () => void;
  page: { id: string; title: string; slug: string };
}

export function StaticPageEditModal({
  open,
  onClose,
  page,
}: StaticPageEditModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["static-page-admin", page.slug],
    queryFn: async () => {
      const res = await getStaticPageByIdAdmin(page.slug);
      if (res.error || !res.data) throw new Error(res.message || "Error");
      return res.data;
    },
    enabled: open && !!page.id,
    refetchOnMount: "always",
  });

  const initValue: StaticPageFormData | undefined = data
    ? {
        id: page.id,
        title: data.title,
        slug: data.slug || page.slug,
        content: data.content,
        section: data.section ?? 0,
        metaDescription: data.metaDescription || "",
        metaKeywords: data.metaKeywords || "",
      }
    : undefined;

  return (
    <SimpleModal
      title="Editar Página"
      subtitle="Actualiza el contenido de la página"
      open={open}
      className="max-w-7xl max-h-[95vh]"
      onClose={onClose}
    >
      <div className="pt-2">
        {isLoading && (
          <p className="text-sm text-gray-500">Cargando contenido...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">
            No se pudieron cargar los datos.
          </p>
        )}
        {initValue && <StaticPageForm initValue={initValue} />}
      </div>
    </SimpleModal>
  );
}
