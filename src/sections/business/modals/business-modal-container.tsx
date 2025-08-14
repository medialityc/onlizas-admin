"use client";

import { useModalState } from "@/hooks/use-modal-state";

import { Business } from "@/types/business";
import { BusinessDetailsModal } from "./business-details-modal";
import BusinessModal from "./business-modal";

interface BusinessModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  business?: Business;
  isDetailsView?: boolean;
}

export default function BusinessModalContainer({
  open,
  onClose,
  business,
  isDetailsView,
  onSuccess,
}: BusinessModalContainerProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!business) return null;
    return (
      <BusinessDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        business={business}
      />
    );
  }

  return (
    <BusinessModal
      loading={false}
      open={open}
      onClose={onClose}
      business={business}
      isDetailsView={isDetailsView}
      onSuccess={onSuccess}
    />
  );
}
