'use client';

import React from 'react';
import { Product } from '@/types/products';
import { DataGrid } from '@/components/datagrid/datagrid';
import Badge from '@/components/badge/badge';
import ActionsMenu from '@/components/menu/actions-menu';
import { paths } from '@/config/paths';
import { useRouter } from 'next/navigation';
import { useModalState } from '@/hooks/use-modal-state';
import { DataTableColumn } from 'mantine-datatable';
import { ProductCreateModal } from '../create/product-create-modal';
import Link from 'next/link';
import useFiltersUrl from '@/hooks/use-filters-url';

interface ProductListProps {
  data?: any;
  searchParams: any;
  onSearchParamsChange?: (params: any) => void; // ahora opcional
}

export function ProductList ({
  data,
  searchParams,
  onSearchParamsChange,
}: ProductListProps) {
  const router = useRouter();
  const { getModalState, openModal, closeModal } = useModalState();
  const { updateFiltersInUrl } = useFiltersUrl();

  const createModal = getModalState('create');

  const handleCreateProduct = () => {
    openModal('create');
  };

  const handleView = (product: Product) => {
    router.push(paths.dashboard.products.view(product.id));
  };

  const handleEdit = (product: Product) => {
    router.push(paths.dashboard.products.edit(product.id));
  };

  const columns: DataTableColumn<Product>[] = [
    {
      accessor: 'name',
      title: 'Nombre',
      sortable: true,
      render: (product) => (
        <div className="font-medium">
          <Link
            href={paths.dashboard.products.view(product.id)}
            className="hover:text-primary"
          >
            {product.name}
          </Link>
        </div>
      ),
    },
    {
      accessor: 'category',
      title: 'Categoría',
      sortable: true,
      render: (product: any) => product.category || 'Sin categoría',
    },
    {
      accessor: 'status',
      title: 'Estado',
      sortable: true,
      render: (product) => (
        <Badge variant={product.status === 'active' ? 'outline-success' : 'outline-secondary'}>
          {product.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      accessor: 'suppliers',
      title: 'Proveedores',
      sortable: true,
      render: (product: any) => product.suppliers || 'Sin proveedores',
    },
    {
      accessor: 'actions',
      title: 'Acciones',
      width: 100,
      sortable: true,
      render: (product) => (
        <ActionsMenu
          onViewDetails={() => handleView(product)}
          onEdit={() => handleEdit(product)}
          isActive={product.status === 'active'}
        />
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Productos</h1>
        </div>
        <DataGrid
          data={data}
          columns={columns}
          onCreate={handleCreateProduct}
          searchParams={searchParams}
          onSearchParamsChange={(p: any) => {
            updateFiltersInUrl(p);
            onSearchParamsChange?.(p);
          }}
          searchPlaceholder="Buscar productos..."
          emptyText="No se encontraron productos"
          createText="Nuevo Producto"
          className="mt-6"
        />
      </div>
      <ProductCreateModal
        open={createModal.open}
        onClose={() => closeModal('create')}
      />
    </>
  );
}