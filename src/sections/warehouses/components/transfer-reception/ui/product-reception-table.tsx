import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { DISCREPANCY_TYPE_OPTIONS } from "@/types/warehouse-transfer-receptions";
import IconTrash from "@/components/icon/icon-trash";

interface ProductReceptionTableProps {
  transfer: WarehouseTransfer;
  items: any[];
  discrepancies: Set<string>;
  isReceptionCompleted?: boolean;
  isSubmitting: boolean;
  onDiscrepancyToggle: (index: number) => void;
  onQuantityChange: (index: number, value: number) => void;
}

export function ProductReceptionTable({
  transfer,
  items,
  discrepancies,
  isReceptionCompleted,
  isSubmitting,
  onDiscrepancyToggle,
  onQuantityChange,
}: ProductReceptionTableProps) {
  const { register, setValue } = useFormContext<CreateTransferReceptionFormData>();

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Productos a Recepcionar
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Verifica las cantidades recibidas para cada producto
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {transfer.items?.map((item, index) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.productVariantName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cantidad transferida: {item.quantityRequested} {item.unit}
                </p>

                {/* Input para cantidad recibida */}
                <div className="mt-3 max-w-xs">
                  <RHFInputWithLabel
                    name={`items.${index}.quantityReceived`}
                    type="number"
                    label="Cantidad Recibida"
                    placeholder="0"
                    minMax={{ min: 0, max: item.quantityRequested }}
                    required
                    className={
                      (items[index]?.quantityReceived || 0) < item.quantityRequested 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : ""
                    }
                  />
                  {/* Mensaje de validación */}
                  {(items[index]?.quantityReceived || 0) < item.quantityRequested && 
                   !discrepancies.has(item.id.toString()) && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      ⚠️ Cantidad menor a la esperada. Debe marcar una incidencia para continuar.
                    </p>
                  )}
                </div>

                {/* Sección de discrepancia - Solo se muestra cuando se marca manualmente */}
                {discrepancies.has(item.id.toString()) && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Incidencia reportada
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <RHFSelectWithLabel
                        name={`items.${index}.discrepancyType`}
                        label="Tipo de Discrepancia"
                        placeholder="Seleccionar tipo"
                        options={DISCREPANCY_TYPE_OPTIONS}
                        showError={false}
                      />
                      <RHFInputWithLabel
                        name={`items.${index}.discrepancyNotes`}
                        placeholder="Describe la incidencia..."
                        label="Observaciones"
                        showError={false}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de marcar discrepancia */}
              <div className="ml-4">
                <Button
                  type="button"
                  variant={discrepancies.has(item.id.toString()) ? "danger" : "secondary"}
                  size="sm"
                  onClick={() => onDiscrepancyToggle(index)}
                >
                  {discrepancies.has(item.id.toString()) ? <IconTrash /> : "Marcar Incidencia"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}