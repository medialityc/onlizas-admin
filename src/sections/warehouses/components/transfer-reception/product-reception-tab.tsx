"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { ProductReceptionTable } from "./ui/product-reception-table";
import { UnexpectedProductsSection } from "./ui/unexpected-products-section";
import { useProductReception } from "../../hooks/useProductReception";

interface Props {
  transfer: WarehouseTransfer;
  isSubmitting: boolean;
  onSaveDraft: () => void;
  canCompleteReception?: () => boolean;
  receptionData?: any;
  isReceptionCompleted?: boolean;
}

export default function ProductReceptionTab({
  transfer,
  isSubmitting,
  onSaveDraft,
  canCompleteReception,
  receptionData,
  isReceptionCompleted,
}: Props) {
  const { control, watch, register } = useFormContext<CreateTransferReceptionFormData>();
  
  const { fields: unexpectedProducts, append: addUnexpectedProduct, remove: removeUnexpectedProduct } =
    useFieldArray({
      control,
      name: "unexpectedProducts",
    });

  const items = watch("items");

  // Hook para gestión de productos
  const productReception = useProductReception(
    transfer,
    items,
    canCompleteReception
  );

  // Manejadores
  const handleDiscrepancyToggle = (index: number) => {
    productReception.toggleDiscrepancy(index);
  };

  const handleAddUnexpectedProduct = (product: any) => {
    addUnexpectedProduct(product);
    productReception.setShowUnexpectedForm(false);
  };

  const handleRemoveUnexpectedProduct = (index: number) => {
    removeUnexpectedProduct(index);
  };

  const handleQuantityChange = (index: number, value: number) => {
    productReception.updateQuantity(index, value);
  };

  return (
    <div className="space-y-6">
      {/* Tabla de productos esperados */}
      <ProductReceptionTable
        transfer={transfer}
        items={items}
        discrepancies={productReception.discrepancies}
        isReceptionCompleted={isReceptionCompleted}
        isSubmitting={isSubmitting}
        onDiscrepancyToggle={handleDiscrepancyToggle}
        onQuantityChange={handleQuantityChange}
      />

      {/* Sección de productos no esperados */}
      <UnexpectedProductsSection
        unexpectedProducts={unexpectedProducts}
        showUnexpectedForm={productReception.showUnexpectedForm}
        onToggleForm={() => productReception.setShowUnexpectedForm(!productReception.showUnexpectedForm)}
        onAddProduct={handleAddUnexpectedProduct}
        onRemoveProduct={handleRemoveUnexpectedProduct}
        isReceptionCompleted={isReceptionCompleted}
      />

      {/* Observaciones Generales - usando el diseño original */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Observaciones Generales
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notas sobre la recepción
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Añade cualquier observación sobre la recepción..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}