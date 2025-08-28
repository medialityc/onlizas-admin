"use client";
import SimpleModal from "@/components/modal/modal";
import { WarehouseForm } from "../components/warehouse-form/warehouse-form";
import { WarehouseFormData } from "../schemas/warehouse-schema";

interface WarehouseCreateModalProps {
  open: boolean;
  onClose: () => void;
  warehouse?: WarehouseFormData;
}

export function WarehouseCreateModal({
  open,
  onClose,
  warehouse,
}: WarehouseCreateModalProps) {
  const isEdit = !!warehouse?.id;

  return (
    <SimpleModal
      key={warehouse?.id || "new"} // Key para reiniciar el form cuando cambia warehouse
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar Almacén" : "Nuevo Almacén"}
    >
      <WarehouseForm warehouse={warehouse} />
    </SimpleModal>
  );
}
