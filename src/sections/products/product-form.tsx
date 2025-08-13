'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { mockCategoryService } from '@/services/categories-mock';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getProductById } from '@/services/products-mock';
import { CreateProduct } from '@/types/products';
import { Button } from '@/components/button/button';
import InputWithLabel from '@/components/input/input-with-label';
import { Select } from '@/components/select/select';
import Checkbox from '@/components/checkbox/checkbox';
import { paths } from '@/config/paths';

export function ProductForm ({ product }: { product?: any }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!product;

  const [formData, setFormData] = useState<CreateProduct>({
    name: product?.name || '',
    description: product?.description || '',
    categoryId: product?.categoryId || 0,
    status: product?.status || 'active',
    upcCode: product?.upcCode || '',
    npnCode: product?.npnCode || '',
    images: product?.images || [],
    variants: product?.variants || {},
    specifications: product?.specifications || [],
    featuredCharacteristics: product?.featuredCharacteristics || [],
    dimensions: product?.dimensions || { unit: 'cm' },
    warranty: product?.warranty || '',
    supplierIds: product?.supplierIds || []
  });

  const mutation = useMutation({
    mutationFn: (data: CreateProduct) =>
      isEdit ? updateProduct(product.id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push(paths.dashboard.products.list);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const CategorySelect = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
    const { data: categories = [] } = useQuery({
      queryKey: ['categories'],
      queryFn: mockCategoryService.getAll
    });

    return (
      <Select
        label="Categoría *"
        value={value}
        onChange={(value) => onChange(Number(value))}
        options={categories}
        objectValueKey="id"
        objectKeyLabel="name"
        placeholder="Seleccionar categoría"
        required
        name="categoryId"
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithLabel
            id="name"
            label="Nombre del producto *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <CategorySelect
            value={formData.categoryId}
            onChange={(value) => setFormData(prev => ({ ...prev, categoryId: Number(value) }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Descripción
          </label>
          <textarea
            className="form-input w-full"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputWithLabel
            id="upcCode"
            label="Código UPC"
            value={formData.upcCode || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, upcCode: e.target.value }))}
            maxLength={12}
          />

          <InputWithLabel
            id="npnCode"
            label="Código NPN"
            value={formData.npnCode || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, npnCode: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputWithLabel
            id="height"
            label="Alto (cm)"
            type="number"
            value={formData.dimensions?.height?.toString() || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              dimensions: { ...prev.dimensions, height: Number(e.target.value), unit: 'cm' }
            }))}
          />

          <InputWithLabel
            id="width"
            label="Ancho (cm)"
            type="number"
            value={formData.dimensions?.width?.toString() || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              dimensions: { ...prev.dimensions, width: Number(e.target.value), unit: 'cm' }
            }))}
          />

          <InputWithLabel
            id="depth"
            label="Profundidad (cm)"
            type="number"
            value={formData.dimensions?.depth?.toString() || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              dimensions: { ...prev.dimensions, depth: Number(e.target.value), unit: 'cm' }
            }))}
          />
        </div>

        <InputWithLabel
          id="warranty"
          label="Garantía"
          value={formData.warranty || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
        />

        <Checkbox
          label="Producto activo"
          checked={formData.status === 'active'}
          onCheckedChange={(checked) => setFormData(prev => ({
            ...prev,
            status: checked ? 'active' : 'inactive'
          }))}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {isEdit ? 'Actualizar' : 'Crear'} Producto
          </Button>
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={() => router.push(paths.dashboard.products.list)}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}