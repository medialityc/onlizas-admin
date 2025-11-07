"use client";

import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/react-hook-form/form-provider";
import { unexpectedProductSchema, UnexpectedProductFormSchema } from "@/sections/warehouses/schemas/transfer-reception-schema";

interface Props {
  onSave: (product: UnexpectedProductFormSchema) => void;
  onCancel: () => void;
}
type UnexpectedProductFormValues = UnexpectedProductFormSchema;

export default function UnexpectedProductForm({ onSave, onCancel }: Props) {
  const form = useForm<UnexpectedProductFormValues>({
    resolver: zodResolver(unexpectedProductSchema),
    defaultValues: {
      productName: "",
      quantity: 0 as any, // se mostrará vacío en input number hasta interacción
      unit: "",
      batchNumber: "",
      observations: "",
    },
  });

  const { handleSubmit, reset, formState: { errors } } = form;

  const onSubmit = (data: UnexpectedProductFormValues, e?: React.BaseSyntheticEvent) => {
    // prevenir bubbling si está dentro de otro form
    e?.stopPropagation();
    onSave(data);
    reset();
  };

  return (
    <FormProvider methods={form} onSubmit={onSubmit} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-4" id="unexpected-product-form">
      <h4 className="font-medium text-blue-900 dark:text-blue-100">Agregar Producto No Esperado</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInputWithLabel
          name="productName"
          label="Nombre del Producto *"
          placeholder="Ingrese el nombre del producto"
          required
          showError
        />
        <RHFInputWithLabel
          name="quantity"
          type="number"
          label="Cantidad Recibida *"
          placeholder="0"
          required
          showError
          minMax={{ min: 0, max: 999999 }}
        />
        <RHFSelectWithLabel
          name="unit"
          label="Unidad *"
          placeholder="Seleccionar unidad"
          options={[
            { value: "kg", label: "Kilogramos (kg)" },
            { value: "g", label: "Gramos (g)" },
            { value: "l", label: "Litros (l)" },
            { value: "ml", label: "Mililitros (ml)" },
            { value: "unidades", label: "Unidades" },
            { value: "cajas", label: "Cajas" },
            { value: "paquetes", label: "Paquetes" },
          ]}
          required
          showError
        />
        <RHFInputWithLabel
          name="batchNumber"
          label="Número de Lote"
          placeholder="Opcional"
          showError={false}
        />
      </div>
      <RHFInputWithLabel
        name="observations"
        type="textarea"
        label="Observaciones"
        placeholder="Añade cualquier observación sobre este producto..."
        rows={2}
        showError={false}
      />
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={(e)=> { e.stopPropagation(); onCancel(); }}>Cancelar</Button>
        <Button type="submit" variant="primary">Agregar Producto</Button>
      </div>
    </FormProvider>
  );
}