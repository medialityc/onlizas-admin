import UnitsModal from "./units-modal";
import { UnitsDetailsModal } from "./units-details-modal";
import { Units } from "@/types/units";

interface UnitsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  unit?: Units;
  isDetailsView?: boolean;
}

export default function UnitsModalContainer({
  open,
  onClose,
  unit,
  isDetailsView,
  onSuccess,
}: UnitsModalProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!unit) return null;
    return (
      <UnitsDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        unit={unit}
      />
    );
  }

  return (
    <UnitsModal
      loading={false}
      onClose={onClose}
      open={open}
      unit={unit}
      onSuccess={onSuccess}
    />
  );
}
