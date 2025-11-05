"use client";

import SimpleModal from "@/components/modal/modal";
import BrandForm from "../components/brand-form";
import { BrandFormData } from "../schemas/brand-schema";

interface BrandCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function BrandCreateModal({ open, onClose }: BrandCreateModalProps) {
  return (
    <SimpleModal
      title="Crear Marca"
      subtitle="Registra una nueva marca"
      open={open}
      onClose={onClose}
    >
      <div className="pt-2">
        <BrandForm />
      </div>
    </SimpleModal>
  );
}
