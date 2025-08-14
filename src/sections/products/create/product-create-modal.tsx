'use client';

import ProductForm from '../product-form';

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductCreateModal ({ open, onClose }: ProductCreateModalProps) {
  return (
    <ProductForm
      isModal={true}
      open={open}
      onClose={onClose}
    />
  );
}