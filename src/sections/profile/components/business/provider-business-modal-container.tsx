import { Business } from "@/types/business";
import ProviderBusinessModal from "./provider-business-modal";

interface ProviderBusinessModalContainerProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data?: Business) => void;
  business?: Business;
  userId?: number|string;
}

export default function ProviderBusinessModalContainer({
  open,
  onClose,
  business,
  userId,
  onSuccess,
}: ProviderBusinessModalContainerProps) {
  if (!open) return null;

  return (
    <ProviderBusinessModal
      loading={false}
      open={open}
      onClose={onClose}
      business={business}
      userId={userId}
      onSuccess={onSuccess}
    />
  );
}
