"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input"; // legacy input for few cases
import { WarehouseTransfer } from "@/types/warehouses-transfers";

import { useFormContext, useFieldArray } from "react-hook-form";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { useState, useEffect } from "react";
import UnexpectedProductForm from "./unexpected-product-form";


interface Props {
    transfer: WarehouseTransfer;
    isSubmitting: boolean;
    onSaveDraft: () => void;
    canCompleteReception?: () => boolean;
}

export default function ProductReceptionTab({
    transfer,
    isSubmitting,
    onSaveDraft,
    canCompleteReception,
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

    // Usar la función de validación pasada por props, o calcularla localmente
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

    // Lógica automática de discrepancias
    useEffect(() => {
        const newDiscrepancies = new Set<string>();
        
        transfer.items?.forEach((transferItem, index) => {
            const item = items[index];
            if (item) {
                const quantityReceived = item.quantityReceived || 0;
                const quantityRequested = transferItem.quantityRequested;
                
                // Marcar discrepancia automáticamente si:
                // 1. Cantidad recibida es 0 (producto no llegó)
                // 2. Cantidad recibida es menor a la solicitada
                if (quantityReceived === 0 || quantityReceived < quantityRequested) {
                    newDiscrepancies.add(transferItem.id.toString());
                    
                    // Si no tiene tipo de discrepancia, asignar uno por defecto
                    if (!item.discrepancyType) {
                        setValue(`items.${index}.discrepancyType`, 
                            quantityReceived === 0 ? "missing_quantity" : "missing_quantity");
                    }
                    
                    // Marcar como no aceptado por defecto
                    setValue(`items.${index}.isAccepted`, false);
                } else {
                    // Si la cantidad está completa, quitar discrepancia automática
                    // pero permitir discrepancias manuales (por ejemplo, producto dañado)
                    if (item.discrepancyType !== "damaged_product" && 
                        item.discrepancyType !== "expired_product" && 
                        item.discrepancyType !== "wrong_batch") {
                        // Solo quitar si no es una discrepancia manual
                        setValue(`items.${index}.discrepancyType`, null);
                        setValue(`items.${index}.discrepancyNotes`, "");
                        setValue(`items.${index}.isAccepted`, true);
                    }
                }
            }
        });
        
        setDiscrepancies(newDiscrepancies);
    }, [items, transfer.items, setValue]);

    const handleDiscrepancyToggle = (index: number) => {
        const newDiscrepancies = new Set(discrepancies);
        const itemId = transfer.items[index].id.toString();
        const item = items[index];
        const quantityReceived = item?.quantityReceived || 0;
        const quantityRequested = transfer.items[index].quantityRequested;
        
        if (newDiscrepancies.has(itemId)) {
            // Solo permitir quitar discrepancia si no es automática
            if (quantityReceived === 0 || quantityReceived < quantityRequested) {
                // No permitir quitar discrepancias automáticas por cantidad
                return;
            }
            
            newDiscrepancies.delete(itemId);
            // Al quitar discrepancia manual, resetear los campos relacionados
            setValue(`items.${index}.discrepancyType`, null);
            setValue(`items.${index}.discrepancyNotes`, "");
            setValue(`items.${index}.isAccepted`, true);
        } else {
            newDiscrepancies.add(itemId);
            // Al marcar discrepancia manual, inicializar con valores por defecto
            setValue(`items.${index}.discrepancyType`, "damaged_product");
            setValue(`items.${index}.discrepancyNotes`, "");
            setValue(`items.${index}.isAccepted`, false);
        }
        setDiscrepancies(newDiscrepancies);
    };

    const handleAddUnexpectedProduct = (product: any) => {
        addUnexpectedProduct(product);
        setShowUnexpectedForm(false);
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
                                            (items[index]?.quantityReceived || 0) < item.quantityRequested && 
                                            !discrepancies.has(item.id.toString()) 
                                              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                                              : ""
                                          }
                                        />
                                        {/* Mensaje de validación */}
                                        {(items[index]?.quantityReceived || 0) < item.quantityRequested && 
                                         !discrepancies.has(item.id.toString()) && (
                                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            ⚠️ Cantidad menor a la esperada. Debe marcar una incidencia.
                                          </p>
                                        )}
                                    </div>

                                    {/* Sección de discrepancia */}
                                    {discrepancies.has(item.id.toString()) && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                                                {items[index]?.quantityReceived === 0 || (items[index]?.quantityReceived || 0) < item.quantityRequested 
                                                    ? "Discrepancia automática por cantidad" 
                                                    : "Incidencia reportada"}
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <RHFSelectWithLabel
                                                    name={`items.${index}.discrepancyType`}
                                                    label="Tipo de Discrepancia"
                                                    placeholder="Seleccionar tipo"
                                                    options={[
                                                        { value: "wrong_product", label: "Producto Incorrecto" },
                                                        { value: "missing_quantity", label: "Cantidad Faltante" },
                                                        { value: "excess_quantity", label: "Cantidad Sobrante" },
                                                        { value: "wrong_batch", label: "Lote Incorrecto" },
                                                        { value: "damaged_product", label: "Producto Dañado" },
                                                        { value: "expired_product", label: "Producto Vencido" },
                                                        { value: "other", label: "Otro" },
                                                    ]}
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

                                {/* Botón de marcar discrepancia manual */}
                                <div className="ml-4">
                                    <Button
                                        type="button"
                                        variant={discrepancies.has(item.id.toString()) ? "danger" : "secondary"}
                                        size="sm"
                                        onClick={() => handleDiscrepancyToggle(index)}
                                        disabled={
                                            // Deshabilitar si ya hay discrepancia automática por cantidad
                                            (items[index]?.quantityReceived || 0) < item.quantityRequested ||
                                            (items[index]?.quantityReceived || 0) === 0
                                        }
                                    >
                                        {discrepancies.has(item.id.toString()) ? "Quitar Incidencia" : "Incidencia Adicional"}
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
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Productos No Esperados
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
                                className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {product.productName}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Cantidad: {product.quantity} {product.unit}
                                            {product.batchNumber && ` | Lote: ${product.batchNumber}`}
                                        </p>
                                        {product.observations && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {product.observations}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeUnexpectedProduct(index)}
                                    >
                                        Eliminar
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

            {/* Finalizar Recepción */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Finalizar Recepción
                </h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Observaciones Generales
                    </label>
                    <textarea
                        {...register("notes")}
                        rows={3}
                        placeholder="Añade cualquier observación sobre la recepción..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onSaveDraft}
                        disabled={isSubmitting}
                    >
                        Guardar Borrador
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || !validationFunction()}
                    >
                        {isSubmitting ? "Completando..." : "Completar Recepción"}
                    </Button>
                </div>
            </div>
        </div>
    );
}