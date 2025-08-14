import { ProductForm } from '../product-form';
import { Product } from '@/types/products';

interface ProductEditModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function ProductEditModal ({ product, open, onClose }: ProductEditModalProps) {
  return (
    <ProductForm
      product={product}
      isModal={true}
      open={open}
      onClose={onClose}
    />
  );
}
