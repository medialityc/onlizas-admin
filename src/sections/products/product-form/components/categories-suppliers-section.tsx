'use client';

import RHFAutocompleteFetcherInfinity from '@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity';
import { getAllCategories } from '@/services/categories';
import { getAllSuppliers } from '@/services/supplier';

function CategoriesAndSuppliersSection() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📦</span> Categorías y Proveedores
      </h3>
      <div className="space-y-6">
        <div>
          <RHFAutocompleteFetcherInfinity
            name="categoryIds"
            label="Categorías"
            placeholder="Seleccionar categorías..."
            onFetch={getAllCategories}
            objectValueKey="id"
            objectKeyLabel="name"
            queryKey="categories"
            required
            multiple
          />
        </div>
        <div>
          <RHFAutocompleteFetcherInfinity
            name="supplierIds"
            label="Proveedores"
            placeholder="Seleccionar proveedores..."
            onFetch={getAllSuppliers}
            objectValueKey="id"
            objectKeyLabel="name"
            queryKey="suppliers"
            multiple
          />
        </div>
      </div>
    </div>
  );
}

export default CategoriesAndSuppliersSection;
