"use client";

import RHFAutocompleteLocalAdapter from "@/components/react-hook-form/rhf-autocomplete-local-adapter";
import IconBox from "@/components/icon/icon-box";
import { EnhancedCategory } from "@/types/suppliers";

function SupplierCategoriesSection({
  categories,
}: {
  categories: EnhancedCategory[];
}) {
  console.log(categories);
  const approvedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));
  const disabled = !categories || categories.length === 0;
  return (
    <div className="bg-blur-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <IconBox className="mr-2 w-5 h-5" /> Categorías aprobadas
      </h3>
      <div className="space-y-2">
        <RHFAutocompleteLocalAdapter
          name="categoryIds"
          label="Categorías"
          placeholder={
            disabled
              ? "Sin categorías aprobadas disponibles"
              : "Seleccionar categorías aprobadas..."
          }
          localData={approvedCategories}
          objectValueKey="id"
          objectKeyLabel="name"
          required
          multiple
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default SupplierCategoriesSection;
