import SuppliersModal from "./suppliers-modal";
import { SuppliersDetailsModal } from "./suppliers-details-modal";
import { Supplier } from "@/types/suppliers";

interface SuppliersModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  supplier?: Supplier;
  isDetailsView?: boolean;
}

export default function SuppliersModalContainer({
  open,
  onClose,
  supplier,
  isDetailsView,
  onSuccess,
}: SuppliersModalContainerProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!supplier) return null;
    return (
      <SuppliersDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        supplier={supplier}
      />
    );
  }
  return (
    <SuppliersModal
      loading={false}
      onClose={onClose}
      open={open}
      supplier={supplier}
      onSuccess={onSuccess}
    />
  );
}
