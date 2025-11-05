"use client";

import SimpleModal from "@/components/modal/modal";
import BrandForm from "../components/brand-form";
import { BrandFormData } from "../schemas/brand-schema";

interface BrandEditModalProps {
  open: boolean;
  onClose: () => void;
  brand: { id: string; name: string };
}

export function BrandEditModal({ open, onClose, brand }: BrandEditModalProps) {
  const initValue: BrandFormData = { id: brand.id, name: brand.name };
  return (
    <SimpleModal
      title="Editar Marca"
      subtitle="Actualiza los datos de la marca"
      open={open}
      onClose={onClose}
    >
      <div className="pt-2">
        <BrandForm initValue={initValue} />
      </div>
    </SimpleModal>
  );
}
