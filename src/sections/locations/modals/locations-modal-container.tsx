import { ILocation } from "@/types/locations";
import LocationForm from "../LocationForm";
import { LocationsDetailsModal } from "./locations-details-modal";
import LocationsModal from "./locations-modal";


interface LocationsModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data?: ILocation) => void;
  location?: ILocation;
  isDetailsView?: boolean;
}

export default function LocationsModalContainer({
  open,
  onClose,
  location,
  isDetailsView,
  onSuccess,
}: LocationsModalContainerProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!location) return null;
    return (
      <LocationsDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        location={location}
        
      />
    );
  }

  return (
    <LocationsModal
      loading={false}
      open={open}
      onClose={onClose}
      location={location}
      isDetailsView={isDetailsView}
      onSuccess={onSuccess}
    />
  );
}
