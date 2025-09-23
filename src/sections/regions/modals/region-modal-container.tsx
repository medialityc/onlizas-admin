import { Region } from "@/types/regions";
import RegionDetailsModal from "./details/region-details-modal";
import RegionConfigModal from "./config/region-config-modal";
import RegionModal from "./region-modal";

interface RegionModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data?: Region) => void;
  region?: Region;
  isDetailsView?: boolean;
  isConfigView?: boolean;
}

export default function RegionModalContainer({
  open,
  onClose,
  region,
  isDetailsView,
  isConfigView,
  onSuccess,
}: RegionModalContainerProps) {
  if (!open) return null;

  if (isDetailsView && region) {
    return (
      <RegionDetailsModal
        open={open}
        onClose={onClose}
        region={region}
      />
    );
  }

  if (isConfigView && region) {
    return (
      <RegionConfigModal
        open={open}
        onClose={onClose}
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