"use client";

import { AlertBox } from "@/components/alert/alert-box";
import SimpleModal from "@/components/modal/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import InventoryProviderForm from "../components/inventory-form/inventory-form-container";

interface CreateInventoryModalProps {
  open: boolean;
  onClose: () => void;
  provider?: string;
  forProvider?: boolean;
}

export default function CreateInventoryModal({
  open,
  onClose,
  provider,
  forProvider,
}: CreateInventoryModalProps) {
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleClose = () => {
    setError(null);
    onClose();
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey as string[];
        return Array.isArray(key) && key[0] === "stores";
      },
    });
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
        <InventoryProviderForm
          forProvider={forProvider}
          provider={provider}
          onClose={handleClose}
        />
      </div>
    </SimpleModal>
  );
}
