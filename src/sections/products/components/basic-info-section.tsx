"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import IconBox from "@/components/icon/icon-box";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";

function BasicInfoSection() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <IconBox className="mr-2 w-5 h-5" /> Información Básica
      </h3>
      <div className="grid grid-cols-4   gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <RHFImageUpload
            name="image"
            label="Imagen"
            variant="rounded"
            size="full"
            className="[&>div]:h-80 [&>div]:w-80"
          />
        </div>
        <div className="flex flex-col w-full col-span-1 md:col-span-2 lg:col-span-3 gap-3 md:gap-6">
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
          <RHFCheckbox name="isActive" label="Producto activo" />
        </div>
      </div>
    </div>
  );
}

export default BasicInfoSection;
