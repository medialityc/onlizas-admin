"use client";

import { AlertBox } from "@/components/alert/alert-box";
import SimpleModal from "@/components/modal/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MeWarehouseForm } from "../components/warehouse-form/me-warehouse-form";
import { MeWarehouseFormData } from "../schemas/me-warehouse-schema";

interface Props {
  open: boolean;
  onClose: () => void;
  warehouse?: MeWarehouseFormData;
}

export default function CreateMeWarehouseModal({
  open,
  onClose,
  warehouse,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  useQueryClient();

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title={"Crear nuevo inventario"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}
        <MeWarehouseForm onClose={handleClose} warehouse={warehouse} />
      </div>
    </SimpleModal>
  );
}
