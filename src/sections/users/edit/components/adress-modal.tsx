"use client";

import React from "react";
import SimpleModal from "@/components/modal/modal";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void | Promise<void>;
  editingAddress?: any | null;
}

export function AddressModal({ open, onClose }: AddressModalProps) {
  return (
    <SimpleModal open={open} onClose={onClose} title="Dirección">
      <div className="p-4">Edición de direcciones deshabilitada.</div>
    </SimpleModal>
  );
}
