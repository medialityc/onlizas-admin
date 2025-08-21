import StoresCreateModal from "./stores-create-modal";

interface StoresModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function StoresModalContainer({
  open,
  onClose,
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
