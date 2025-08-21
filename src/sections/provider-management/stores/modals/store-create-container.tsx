import StoresCreateModal from "./stores-create-modal";

interface StoresModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isDetailsView?: boolean;
}

export default function StoresModalContainer({
  open,
  onClose,
  //isDetailsView,
  onSuccess,
}: StoresModalContainerProps) {
  if (!open) return null;

  return (
    <StoresCreateModal
      loading={false}
      onClose={onClose}
      open={open}
      onSuccess={onSuccess}
    />
  );
}
