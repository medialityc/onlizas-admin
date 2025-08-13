'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '@/services/products-mock';
import { CreateProduct } from '@/types/products';
import { Button } from '@/components/button/button';
import InputWithLabel from '@/components/input/input-with-label';
import { Select } from '@/components/select/select';
import Checkbox from '@/components/checkbox/checkbox';
import SimpleModal from '@/components/modal/modal';
import { mockCategoryService } from '@/services/categories-mock';
import { useQuery } from '@tanstack/react-query';

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductCreateModal ({ open, onClose }: ProductCreateModalProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateProduct>({
    name: '',
    description: '',
    categoryId: 0,
    status: 'active',
    upcCode: '',
    npnCode: '',
    images: [],
    variants: {},
    specifications: [],
    featuredCharacteristics: [],
    dimensions: { unit: 'cm' },
    warranty: '',
    supplierIds: []
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: mockCategoryService.getAll
  });

  const mutation = useMutation({
    mutationFn: (data: CreateProduct) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
      setFormData({
        name: '',
        description: '',
        categoryId: 0,
        status: 'active',
        upcCode: '',
        npnCode: '',
        images: [],
        variants: {},
        specifications: [],
        featuredCharacteristics: [],
        dimensions: { unit: 'cm' },
        warranty: '',
        supplierIds: []
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <SimpleModal open={open} onClose={onClose} title="Nuevo Producto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWithLabel
            id="name"
            label="Nombre del producto *"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <Select
            label="Categoría *"
            value={formData.categoryId}
            onChange={(value) => setFormData(prev => ({ ...prev, categoryId: Number(value) }))}
            options={categories}
            objectValueKey="id"
            objectKeyLabel="name"
            placeholder="Seleccionar categoría"
            required
            name="categoryId"
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

        <Checkbox
          label="Producto activo"
          checked={formData.status === 'active'}
          onCheckedChange={(checked) => setFormData(prev => ({
            ...prev,
            status: checked ? 'active' : 'inactive'
          }))}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={mutation.isPending}>
            Crear Producto
          </Button>
          <Button
            type="button"
            variant="secondary"
            outline
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </SimpleModal>
  );
}