"use client";

import { AlertBox } from "@/components/alert/alert-box";
import SimpleModal from "@/components/modal/modal";
import { useState } from "react";
import InventoryEditForm from "../components/inventory-edit-from/inventory-edit-from";
import { ProductVariant } from "../schemas/inventory-provider.schema";

interface Props {
  open: boolean;
  onClose: () => void;
  initValue?: ProductVariant | undefined;
  inventoryId: string;
  supplierId?: string;
  isPacking: boolean;
}

export default function CreateInventoryVariantModal({
  open,
  onClose,
  initValue,
  inventoryId,
  supplierId,
  isPacking,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      size="lg"
      title={initValue?.id ? "Editar variante" : "Crear variante"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}
        <InventoryEditForm
          initValue={initValue}
          inventoryId={inventoryId}
          supplierId={supplierId}
          isPacking={isPacking}
          handleClose={handleClose}
        />
      </div>
    </SimpleModal>
  );
}
