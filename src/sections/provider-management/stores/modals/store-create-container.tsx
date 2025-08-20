
import { Store } from "@/types/stores";
import StoresCreateModal from "./stores-create-modal";

interface StoresModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  store?: Store;
  isDetailsView?: boolean;
}

export default function StoresModalContainer({
  open,
  onClose,
  store,
  //isDetailsView,
  onSuccess,
}: StoresModalContainerProps) {
  if (!open) return null;

  /* if (isDetailsView) {
    if (!supplier) return null;
    return (
      <SuppliersDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        supplier={supplier}
      />
    );
  } */
  return (
    <StoresCreateModal
      loading={false}
      onClose={onClose}
      open={open}
      store={store}
      onSuccess={onSuccess}
    />
  );
}
