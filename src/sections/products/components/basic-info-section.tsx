"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import IconBox from "@/components/icon/icon-box";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";

function BasicInfoSection() {
  return (
    <div className="bg-blur-card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <IconBox className="mr-2 w-5 h-5" /> Información Básica
      </h3>
      <div className="flex flex-col w-full  gap-2 md:gap-4">
        <RHFInputWithLabel
          name="name"
          label="Nombre del Producto"
          placeholder="Ej: iPhone 15 Pro Max"
          required
        />
        <RHFInputWithLabel
          name="description"
          label="Descripción"
          type="textarea"
          placeholder="Describe las características principales del producto..."
          rows={4}
        />
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <RHFImageUpload
            name="image"
            label="Imagen"
            variant="rounded"
            size="full"
          />
        </div>
        <RHFCheckbox name="isActive" label="Producto activo" />
      </div>
    </div>
  );
}

export default BasicInfoSection;

