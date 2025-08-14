'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProduct, updateProduct } from '@/services/products-mock';
import { Product } from '@/types/products';
import { Button } from '@/components/button/button';
import { paths } from '@/config/paths';
import FormProvider from '@/components/react-hook-form/form-provider';
import LoaderButton from '@/components/loaders/loader-button';
import SimpleModal from '@/components/modal/modal';

import {
  productFormSchema,
  ProductFormValues,
  defaultProductFormValues,
  transformToApiFormat
} from './product-form/schema/product-schema';

import ResponsiveLayout from './product-form/layouts/responsive-layout';

interface ProductFormProps {
  product?: Product;
  isModal?: boolean;
  open?: boolean;
  onClose?: () => void;
}

function ProductForm ({ product, isModal = false, open, onClose }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const productToFormData = (product: Product): ProductFormValues => ({
    name: product.name || '',
    description: product.description || '',
    isActive: product.isActive,
    categoryIds: product.categories?.map(cat => cat.id) || [],
    supplierIds: product.suppliers?.map(sup => sup.id) || [],
    dimensions: product.dimensions ? {
      lenght: product.dimensions.lenght,
      width: product.dimensions.width,
      height: product.dimensions.height,
    } : { lenght: undefined, width: undefined, height: undefined },
    about: product.about?.map(item => ({ value: item })) || [],
    details: product.details || [],
    imageFile: undefined,
  });

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? productToFormData(product) : defaultProductFormValues,
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      const transformedData = transformToApiFormat(data);
      const apiData = { ...transformedData, features: [], images: [] };
      return isEdit ? updateProduct(product.id, apiData) : createProduct(apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (isModal) {
        methods.reset(defaultProductFormValues);
        onClose?.();
      } else {
        router.push(paths.dashboard.products.list);
      }
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    if (isModal) {
      onClose?.();
    } else {
      router.push(paths.dashboard.products.list);
    }
  };

  const formContent = (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <ResponsiveLayout />

      {/* Botones de acción */}
      <div className={`flex gap-4 pt-6 mt-6 border-t ${isModal ? 'justify-end' : 'justify-end'}`}>
        <Button
          type="button"
          variant="secondary"
          outline
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <LoaderButton
          type="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
        </LoaderButton>
      </div>
    </FormProvider>
  );

  if (isModal) {
    return (
      <SimpleModal
        open={open || false}
        onClose={onClose || (() => { })}
        title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        className="max-w-[95vw] xl:max-w-7xl w-full mx-4"
      >
        <div className="max-h-[85vh] overflow-y-auto p-2">
          {formContent}
        </div>
      </SimpleModal>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>
      {formContent}
    </div>
  );
}

export default ProductForm;