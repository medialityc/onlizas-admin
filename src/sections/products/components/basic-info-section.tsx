"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import IconBox from "@/components/icon/icon-box";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { RHFSwitch } from "@/components/react-hook-form";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/label/label";

function BasicInfoSection() {
  const { watch } = useFormContext();
  const isDurable = watch("isDurable");
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
        <div className="flex flex-col space-y-1">
          <Label
            htmlFor="isDurable"
            className="text-gray-700 dark:text-gray-200 font-medium"
          >
            Producto Duradero
          </Label>
          <div className="flex items-start space-x-3">
            <RHFSwitch name="isDurable" checked={isDurable} />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isDurable
                ? "Sí, es un producto duradero"
                : "No es un producto duradero"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Los productos duraderos son aquellos que tienen una vida útil
            prolongada y no se consumen inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoSection;
