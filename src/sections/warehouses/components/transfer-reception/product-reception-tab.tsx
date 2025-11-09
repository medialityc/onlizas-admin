"use client";

import { Button } from "@/components/button/button";
import { WarehouseTransfer } from "@/types/warehouses-transfers";

import { useFormContext, useFieldArray } from "react-hook-form";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useState, useEffect } from "react";
import UnexpectedProductForm from "./unexpected-product-form";
import { DISCREPANCY_TYPE_OPTIONS } from "@/types/warehouse-transfer-receptions";
import showToast from "@/config/toast/toastConfig";
import IconTrash from "@/components/icon/icon-trash";


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
    const { register, watch, setValue, control } = useFormContext<CreateTransferReceptionFormData>();
        const [discrepancies, setDiscrepancies] = useState<Set<string>>(new Set());
    const [showUnexpectedForm, setShowUnexpectedForm] = useState(false);

    const { fields: unexpectedProducts, append: addUnexpectedProduct, remove: removeUnexpectedProduct } =
        useFieldArray({
            control,
            name: "unexpectedProducts",
        });

    const items = watch("items");

    // Lógica de validación para completar recepción
    const validationFunction = canCompleteReception || (() => {
        return transfer.items?.every((transferItem, index) => {
            const item = items[index];
            const quantityReceived = item?.quantityReceived || 0;
            const quantityRequested = transferItem.quantityRequested;
            
            // Si la cantidad es menor, debe tener discrepancia marcada
            if (quantityReceived < quantityRequested) {
                return discrepancies.has(transferItem.id.toString());
            }
            
            return true;
        }) ?? true;
    });

    // No lógica automática de discrepancias - solo gestión manual
    // Los usuarios deben marcar discrepancias manualmente

    const handleDiscrepancyToggle = (index: number) => {
        const newDiscrepancies = new Set(discrepancies);
        const itemId = transfer.items[index].id.toString();
        
        if (newDiscrepancies.has(itemId)) {
            newDiscrepancies.delete(itemId);
            // Al quitar discrepancia, resetear los campos relacionados
            setValue(`items.${index}.discrepancyType`, null);
            setValue(`items.${index}.discrepancyNotes`, "");
            setValue(`items.${index}.isAccepted`, true);
        } else {
            newDiscrepancies.add(itemId);
            // Al marcar discrepancia, inicializar con valores por defecto
            setValue(`items.${index}.discrepancyType`, "missing_quantity");
            setValue(`items.${index}.discrepancyNotes`, "");
            setValue(`items.${index}.isAccepted`, false);
        }
        setDiscrepancies(newDiscrepancies);
    };

    const handleAddUnexpectedProduct = (product: any) => {
        
        // Agregar el producto a la lista usando useFieldArray
        addUnexpectedProduct(product);
        
        // Cerrar el formulario
        setShowUnexpectedForm(false);
        
        // Mostrar toast de confirmación
        showToast(`Producto "${product.productName}" agregado exitosamente`, "success");
    };

    const handleRemoveUnexpectedProduct = (index: number) => {
        const product = unexpectedProducts[index];
        
        removeUnexpectedProduct(index);
        
        showToast(`Producto "${product.productName}" eliminado`, "info");
    };

    return (
        <div className="space-y-6">
            {/* Productos a Recepcionar */}
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
                                        onClick={() => handleDiscrepancyToggle(index)}
                                    >
                                        {discrepancies.has(item.id.toString()) ? <IconTrash /> : "Marcar Incidencia"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Productos No Esperados */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                                <span>Productos No Esperados</span>
                                {unexpectedProducts.length > 0 && (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                        {unexpectedProducts.length}
                                    </span>
                                )}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Registra productos que llegaron pero no estaban en la lista original
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setShowUnexpectedForm(true)}
                        disabled={isReceptionCompleted}
                    >
                        + Agregar Producto
                    </Button>
                </div>

                {/* Formulario para productos no esperados */}
                {showUnexpectedForm && (
                    <div className="mb-6">
                        <UnexpectedProductForm
                            onSave={handleAddUnexpectedProduct}
                            onCancel={() => setShowUnexpectedForm(false)}
                        />
                    </div>
                )}

                {/* Lista de productos no esperados agregados */}
                {unexpectedProducts.length > 0 ? (
                    <div className="space-y-3">
                        {unexpectedProducts.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                                Producto #{index + 1}
                                            </span>
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {product.productName}
                                            </h4>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">Cantidad:</span> {product.quantity} {product.unit}
                                            </p>
                                            {product.batchNumber && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Lote:</span> {product.batchNumber}
                                                </p>
                                            )}
                                            {product.observations && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium">Observaciones:</span> {product.observations}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRemoveUnexpectedProduct(index)}
                                        disabled={isReceptionCompleted}
                                        title={isReceptionCompleted ? "No puede eliminar productos después de completar la recepción" : "Eliminar producto"}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">
                            No se han registrado productos no esperados
                        </p>
                    </div>
                )}
            </div>

            {/* Observaciones Generales */}
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