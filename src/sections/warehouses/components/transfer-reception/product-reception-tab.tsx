"use client";

import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { WarehouseTransfer } from "@/types/warehouses-transfers";

import { useFormContext, useFieldArray } from "react-hook-form";
import { ReceptionFormData } from "@/types/transfer-reception";
import { useState } from "react";
import UnexpectedProductForm from "./unexpected-product-form";


interface Props {
    transfer: WarehouseTransfer;
    isSubmitting: boolean;
    onSaveDraft: () => void;
}

export default function ProductReceptionTab({
    transfer,
    isSubmitting,
    onSaveDraft,
}: Props) {
    const { register, watch, setValue, control } = useFormContext<ReceptionFormData>();
    const [discrepancies, setDiscrepancies] = useState<Set<number>>(new Set());
    const [showUnexpectedForm, setShowUnexpectedForm] = useState(false);

    const { fields: unexpectedProducts, append: addUnexpectedProduct, remove: removeUnexpectedProduct } =
        useFieldArray({
            control,
            name: "unexpectedProducts",
        });

    const receivedItems = watch("receivedItems");

    const handleDiscrepancyToggle = (itemId: number) => {
        const newDiscrepancies = new Set(discrepancies);
        if (newDiscrepancies.has(itemId)) {
            newDiscrepancies.delete(itemId);
            setValue(`discrepancies.${itemId}` as any, { type: "", notes: "" });
        } else {
            newDiscrepancies.add(itemId);
            setValue(`discrepancies.${itemId}` as any, { type: "Producto Incorrecto", notes: "" });
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
                    {transfer.items?.map((item) => (
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
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Cantidad Recibida
                                        </label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max={item.quantityRequested}
                                            placeholder="0"
                                            {...register(`receivedItems.${item.id}` as any, { valueAsNumber: true })}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Sección de discrepancia */}
                                    {discrepancies.has(item.id) && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <h5 className="font-medium text-red-800 dark:text-red-200 mb-2">
                                                Producto marcado con incidencias
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Tipo de Discrepancia
                                                    </label>
                                                    <select
                                                        {...register(`discrepancies.${item.id}.type` as any)}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    >
                                                        <option value="Producto Incorrecto">Producto Incorrecto</option>
                                                        <option value="Cantidad Incorrecta">Cantidad Incorrecta</option>
                                                        <option value="Producto Dañado">Producto Dañado</option>
                                                        <option value="Producto Faltante">Producto Faltante</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Observaciones
                                                    </label>
                                                    <Input
                                                        placeholder="Describe la incidencia..."
                                                        {...register(`discrepancies.${item.id}.notes` as any)}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botón de marcar discrepancia */}
                                <div className="ml-4">
                                    <Button
                                        type="button"
                                        variant={discrepancies.has(item.id) ? "danger" : "secondary"}
                                        size="sm"
                                        onClick={() => handleDiscrepancyToggle(item.id)}
                                    >
                                        {discrepancies.has(item.id) ? "Quitar Discrepancia" : "Marcar Discrepancia"}
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
                                            Cantidad: {product.quantityReceived} {product.unit}
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Completando..." : "Completar Recepción"}
                    </Button>
                </div>
            </div>
        </div>
    );
}