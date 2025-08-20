"use client";

import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import IconClipboardText from "@/components/icon/icon-clipboard-text";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/button/button";
import IconTrash from "@/components/icon/icon-trash";
import IconPlus from "@/components/icon/icon-plus";

function ProductDetailsSection() {
  const { control } = useFormContext();
  const {
    fields: detailFields,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control,
    name: "details",
  });

  /*  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <IconClipboardText className="mr-2 w-5 h-5" /> Detalles del Producto
        </h3>
      </div>
      <div className="flex flex-col gap-2 md:gap-4">
        <RHFInputWithLabel
          name={`details.additionalProp1`}
          // label="Detalle 1"
          placeholder="Detalle 1"
        />
        <RHFInputWithLabel
          name={`details.additionalProp2`}
          // label="Detalle 2"
          placeholder="Detalle 2"
        />
        <RHFInputWithLabel
          name={`details.additionalProp3`}
          // label="Detalle 3"
          placeholder="Detalle 3"
        />
      </div>
    </div>
  ); */

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <IconClipboardText className="mr-2 w-5 h-5" /> Detalles del Producto
        </h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => appendDetail({ name: "", value: "" })}
          className="flex items-center gap-2"
        >
          <IconPlus className="w-4 h-4" />
          Detalle
        </Button>
      </div>{" "}
      <div className="space-y-4">
        {detailFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-5 gap-3 items-center">
            <div className="col-span-2">
              <RHFInputWithLabel
                name={`details.${index}.name`}
                label="Nombre"
                placeholder="Nombre"
              />
            </div>
            <div className="col-span-2">
              <RHFInputWithLabel
                name={`details.${index}.value`}
                label="Valor"
                placeholder="Valor"
              />
            </div>
            <div className="col-span-1 pb-1 h-full flex justify-end items-end">
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={() => removeDetail(index)}
              >
                <IconTrash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetailsSection;
