import { Region } from "@/types/regions";
import { RegionDetailsModal } from "./region-details-modal";
import RegionModal from "./region-modal";


interface RegionModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data?: Region) => void;
  region?: Region;
  isDetailsView?: boolean;
}

export default function RegionModalContainer({
  open,
  onClose,
  region,
  isDetailsView,
  onSuccess,
}: RegionModalContainerProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!region) return null;
    return (
      <RegionDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        region={region}
      />
    );
  }

  return (
    <RegionModal
      loading={false}
      open={open}
      onClose={onClose}
      region={region}
      isDetailsView={isDetailsView}
      onSuccess={onSuccess}
    />
  );
}
