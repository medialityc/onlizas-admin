"use client";

import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
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

  const { handleSubmit, reset, setValue, formState: { errors } } = form;

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
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Unidad *</label>
          <select
            value={form.watch("unit")}
            onChange={(e) => setValue("unit", e.target.value, { shouldValidate: true })}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.unit ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            aria-label="Unidad"
            title="Unidad"
          >
            <option value="">Seleccionar unidad</option>
            <option value="kg">Kilogramos (kg)</option>
            <option value="g">Gramos (g)</option>
            <option value="l">Litros (l)</option>
            <option value="ml">Mililitros (ml)</option>
            <option value="unidades">Unidades</option>
            <option value="cajas">Cajas</option>
            <option value="paquetes">Paquetes</option>
          </select>
          {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>}
        </div>
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