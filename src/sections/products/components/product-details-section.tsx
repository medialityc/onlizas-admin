"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import IconClipboardText from "@/components/icon/icon-clipboard-text";

function ProductDetailsSection() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <IconClipboardText className="mr-2 w-5 h-5" /> Detalles del Producto
        </h3>
      </div>
      <div className="space-y-4">
        <RHFInputWithLabel name={"details.additionalProp1"} placeholder="Detalle 1" />
        <RHFInputWithLabel name={"details.additionalProp2"} placeholder="Detalle 2" />
        <RHFInputWithLabel name={"details.additionalProp3"} placeholder="Detalle 3" />
      </div>
    </div>
  );
}

export default ProductDetailsSection;
