import CategoriesModal from "./categories-modal";
import { CategoriesDetailsModal } from "./categories-details-modal";
import { Category } from "@/types/categories";

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category?: Category;
  isDetailsView?: boolean;
}

export default function CategoriesModalContainer({
  open,
  onClose,
  category,
  isDetailsView,
  onSuccess,
}: CategoriesModalProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (!category) return null;
    return (
      <CategoriesDetailsModal
        loading={false}
        onClose={onClose}
        open={open}
        category={category}
      />
    );
  }

  return (
    <CategoriesModal
      loading={false}
      onClose={onClose}
      open={open}
      category={category}
      onSuccess={onSuccess}
    />
  );
}
