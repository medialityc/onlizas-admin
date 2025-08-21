"use client";

import ProductFormProvider from "../product-form/product-form";

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductCreateProviderModal({
  open,
  onClose,
}: ProductCreateModalProps) {
  return <ProductFormProvider isModal={true} open={open} onClose={onClose} />;
}
