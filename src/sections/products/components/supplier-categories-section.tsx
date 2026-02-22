"use client";

import RHFAutocompleteLocalAdapter from "@/components/react-hook-form/rhf-autocomplete-local-adapter";
import IconBox from "@/components/icon/icon-box";
import { useSupplierApprovalProcess } from "@/sections/profile/hooks/use-supplier-approval-process";
import { Category } from "@/types/categories";

function SupplierCategoriesSection() {
  const { data, isLoading, isError } = useSupplierApprovalProcess();

  const approvedCategories: Category[] =
    data?.approvedCategories.map((cat: any) => cat.category) ?? [];

  const disabled = isLoading || isError || approvedCategories.length === 0;

  return (
    <div className="bg-blur-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <IconBox className="mr-2 w-5 h-5" /> Categorías aprobadas
      </h3>
      <div className="space-y-2">
        {disabled && (
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Cargando categorías aprobadas..."
              : "No tienes categorías aprobadas aún para asociar a este producto."}
          </p>
        )}
        <RHFAutocompleteLocalAdapter<Category>
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
