"use client";

import SimpleModal from "@/components/modal/modal";
import StaticPageForm from "../components/static-page-form";

interface StaticPageCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function StaticPageCreateModal({
  open,
  onClose,
}: StaticPageCreateModalProps) {
  return (
    <SimpleModal
      title="Crear Página"
      subtitle="Registra una nueva página estática"
      open={open}
      onClose={onClose}
      className="max-w-7xl max-h-[95vh]"
    >
      <div className="pt-2">
        <StaticPageForm />
      </div>
    </SimpleModal>
  );
}
