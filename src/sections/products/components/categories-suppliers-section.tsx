"use client";

import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllCategories } from "@/services/categories";
import { RHFSuppliersByCategory } from "@/components/react-hook-form/rhf-suppliers-by-category";
import IconBox from "@/components/icon/icon-box";

function CategoriesAndSuppliersSection({
  hideSupplier,
}: {
  hideSupplier?: boolean;
}) {
  return (
    <div className="bg-blur-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <IconBox className="mr-2 w-5 h-5" /> Categorías
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
        {!hideSupplier && (
          <div>
            <RHFSuppliersByCategory
              name="supplierUserIds"
              label="Usuarios proveedores"
              placeholder="Seleccionar usuarios proveedores..."
              multiple
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoriesAndSuppliersSection;
