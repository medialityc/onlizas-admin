"use client";

import { Button } from "@/components/button/button";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { TransferReception } from "@/types/warehouse-transfer-receptions";
import showToast from "@/config/toast/toastConfig";
import { receiveTransfer, reportDiscrepancy } from "@/services/warehouse-transfer-receptions";

import ProductReceptionTab from "./product-reception-tab";
import IncidentsManagementTab from "./incidents-management-tab";
import DocumentationTab from "./documentation-tab";

interface Props {
    transfer: WarehouseTransfer;
    isSubmitting: boolean;
    onSaveDraft: () => void;
    canCompleteReception?: () => boolean;
}

interface Step {
    id: string;
    title: string;
    description: string;
    component: React.ReactNode;
    isValid?: () => boolean;
    isOptional?: boolean;
}

export default function TransferReceptionWizard({
    transfer,
    isSubmitting,
    onSaveDraft,
    canCompleteReception,
}: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [localReceptionData, setLocalReceptionData] = useState<any>(null);
    const [isReceiving, setIsReceiving] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isReceptionCompleted, setIsReceptionCompleted] = useState(false);
    const { watch, formState, getValues } = useFormContext<CreateTransferReceptionFormData>();
    const items = watch("items");
    const router = useRouter();

    // Función para generar GUID
    const generateGuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // Función para recibir la transferencia
    const handleReceiveTransfer = useCallback(async () => {
        // Check: Si ya tenemos un ID de recepción, no volver a llamar receive
        if (isReceiving || localReceptionData?.id) {
            
            // Solo avanzar al siguiente paso
            setShowConfirmDialog(false);
            setCurrentStep(1);
            return;
        }

        try {
            setIsReceiving(true);
            const formData = getValues();

            // Generar payload para el receive
            const payload = {
                transferId: formData.transferId,
                receivingWarehouseId: transfer.destinationId,
                notes: formData.notes || "",
                items: [
                    // Items esperados
                    ...formData.items.map((item) => ({
                        transferItemId: item.transferItemId,
                        productVariantId: item.productVariantId,
                        quantityReceived: item.quantityReceived,
                        unit: item.unit,
                        receivedBatch: item.receivedBatch || null,
                        receivedExpiryDate: item.receivedExpiryDate || null,
                        discrepancyType: item.discrepancyType || null,
                        discrepancyNotes: item.discrepancyNotes || null,
                        isAccepted: item.isAccepted ?? true,
                    })),
                    // Productos inesperados con GUID generado
                    ...(formData.unexpectedProducts || []).map((product) => ({
                        transferItemId: generateGuid(), // Generar GUID para productos no esperados
                        productVariantId: generateGuid(), // También necesitará un productVariantId
                        quantityReceived: product.quantity,
                        unit: product.unit,
                        receivedBatch: product.batchNumber || null,
                        receivedExpiryDate: null, // Se puede agregar si el form lo tiene
                        discrepancyType: "unexpected_product" as any,
                        discrepancyNotes: `Producto no esperado: ${product.productName}. ${product.observations || ""}`,
                        isAccepted: true,
                    }))
                ]
            };

            const response = await receiveTransfer(payload);

            if (response?.error) {
                console.error("❌ [RECEIVE ERROR] Error en la respuesta del receive:", response.error);
                showToast("Error al recibir la transferencia", "error");
                return;
            }

            // Extraer datos de la respuesta y guardar en estado local
            const responseData = response.data as any;
            const reception = responseData?.reception || responseData;
            
            // Validar que tenemos un ID
            const receptionId = reception?.id || responseData?.id;
            if (!receptionId) {
                console.error("❌ [RECEIVE ERROR] No se recibió ID de recepción en la respuesta");
                showToast("Error: No se pudo obtener el ID de la recepción", "error");
                return;
            }
            
            // Crear objeto local con la estructura que necesitamos
            const localReception = {
                id: receptionId,
                transferId: reception?.transferId || responseData?.transferId,
                status: reception?.status || responseData?.status,
                hasDiscrepancies: reception?.hasDiscrepancies || responseData?.hasDiscrepancies,
                items: reception?.items || responseData?.items || [],
                comments: reception?.comments || responseData?.comments || [],
                receivedAt: reception?.receivedAt || responseData?.receivedAt,
                notes: reception?.notes || responseData?.notes,
                // Agregar toda la info que necesitemos
                ...reception,
                ...responseData
            };
            
            setLocalReceptionData(localReception);
            setIsReceptionCompleted(true);
            
            showToast("Transferencia recibida exitosamente", "success");

            // Avanzar al siguiente paso
            setCurrentStep(1);

        } catch (error) {
            console.error("💥 [RECEIVE EXCEPTION] Error inesperado en receive:", error);
            showToast("Error inesperado al recibir la transferencia", "error");
        } finally {
            setIsReceiving(false);
            setShowConfirmDialog(false);
        }
    }, [transfer, getValues, isReceiving, localReceptionData]);



    // Validación para el paso 1: Recepción de Productos
    const validateReceptionStep = () => {
        // Verificar que todas las cantidades estén ingresadas
        const allQuantitiesEntered = transfer.items?.every((_, index) => {
            const item = items[index];
            return item && typeof item.quantityReceived === 'number' && item.quantityReceived >= 0;
        }) ?? true;

        if (!allQuantitiesEntered) {
            return false;
        }

        // Verificar que las cantidades menores tengan discrepancias marcadas
        const shortQuantitiesHaveDiscrepancies = transfer.items?.every((transferItem, index) => {
            const item = items[index];
            const quantityReceived = item?.quantityReceived || 0;
            const quantityRequested = transferItem.quantityRequested;
            
            // Si la cantidad es menor, debe tener discrepancia marcada
            if (quantityReceived < quantityRequested) {
                return item?.discrepancyType !== null && 
                       item?.discrepancyType !== undefined;
            }
            
            return true;
        }) ?? true;

        return shortQuantitiesHaveDiscrepancies;
    };

    // Validación para el paso 2: Gestión de Incidencias (opcional)
    const validateIncidentsStep = () => {
        // Este paso es opcional, siempre es válido
        return true;
    };

    // Validación para el paso 3: Documentación (opcional)
    const validateDocumentationStep = () => {
        // Este paso es opcional, siempre es válido
        return true;
    };

    const steps: Step[] = [
        {
            id: "reception",
            title: "Recepción de Productos",
            description: "Verifica las cantidades recibidas y reporta incidencias",
            component: (
                <ProductReceptionTab
                    transfer={transfer}
                    isSubmitting={isSubmitting || isReceiving}
                    onSaveDraft={onSaveDraft}
                    canCompleteReception={canCompleteReception}
                    receptionData={localReceptionData}
                    isReceptionCompleted={isReceptionCompleted}
                />
            ),
            isValid: validateReceptionStep,
        },
        {
            id: "incidents",
            title: "Gestión de Incidencias",
            description: "Revisa y gestiona las incidencias reportadas",
            component: <IncidentsManagementTab transfer={transfer} receptionId={localReceptionData?.id} receptionData={localReceptionData} setData={setLocalReceptionData}/>,
            isValid: validateIncidentsStep,
            isOptional: true,
        },
        {
            id: "documentation",
            title: "Documentación",
            description: "Adjunta evidencia y documentación adicional",
            component: <DocumentationTab transfer={transfer} receptionData={localReceptionData} />,
            isValid: validateDocumentationStep,
            isOptional: true,
        },
    ];

    const currentStepData = steps[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;
    const canGoNext = currentStepData.isValid ? currentStepData.isValid() : true;
    const canSubmit = isLastStep && (canCompleteReception ? canCompleteReception() : true);

    const handleNext = async (event?: React.MouseEvent) => {
        // Prevenir cualquier propagación o submit por defecto
        event?.preventDefault();
        event?.stopPropagation();

        // Si estamos en el primer paso y no hemos recibido la transferencia aún
        if (currentStep === 0 && !localReceptionData?.id) {
            setShowConfirmDialog(true);
            return;
        }

        // Para cualquier otro caso (ya tenemos recepción o estamos en pasos posteriores), navegación normal
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        // No permitir regresar al paso de recepción si ya se completó
        if (currentStep === 1 && isReceptionCompleted) {
            showToast("No puede regresar al paso anterior una vez completada la recepción", "warning");
            return;
        }

        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepIndex: number) => {
        // No permitir navegar al paso de recepción si ya está completada
        if (stepIndex === 0 && isReceptionCompleted && currentStep > 0) {
            showToast("No puede modificar la recepción una vez completada", "warning");
            return;
        }

        // Solo permitir navegar a pasos anteriores o al siguiente si es válido
        if (stepIndex < currentStep) {
            setCurrentStep(stepIndex);
        } else if (stepIndex === currentStep + 1 && canGoNext) {
            setCurrentStep(stepIndex);
        }
    };

    return (
        <div className="space-y-6">
            {/* Indicador de progreso */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            Transferencia Id: {transfer.id}
                        </div>
                        {localReceptionData?.id && (
                            <div className="text-lg text-green-600 dark:text-green-400 font-medium">
                                Recepción ID: {localReceptionData.id}
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Paso {currentStep + 1} de {steps.length}
                    </div>
                </div>

                {/* Stepper horizontal */}
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`flex items-center cursor-pointer ${
                                    index <= currentStep ? "text-blue-600" : "text-gray-400"
                                }`}
                                onClick={() => handleStepClick(index)}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                                        index < currentStep
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : index === currentStep
                                            ? "border-blue-600 text-blue-600 bg-white dark:bg-gray-800"
                                            : "border-gray-300 text-gray-400 bg-white dark:bg-gray-800"
                                    }`}
                                >
                                    {index < currentStep ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <div className="ml-3 hidden sm:block">
                                    <div className="text-sm font-medium flex items-center space-x-2">
                                        <span>{step.title}</span>
                                        {index === 0 && isReceptionCompleted && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                Completado
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">{step.description}</div>
                                    {step.isOptional && (
                                        <div className="text-xs text-gray-400">(Opcional)</div>
                                    )}
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-16 h-0.5 mx-4 ${
                                        index < currentStep ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Indicador de validación del paso actual */}
                {!canGoNext && currentStepData.isValid && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Para continuar al siguiente paso:
                                </p>
                                <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside">
                                    {currentStep === 0 && (
                                        <>
                                            <li>Ingrese las cantidades recibidas para todos los productos</li>
                                            <li>Marque incidencias para productos con cantidades menores a las esperadas</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido del paso actual */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {currentStepData.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {currentStepData.description}
                    </p>
                </div>
                <div className="p-6">
                    {currentStepData.component}
                </div>
            </div>

            {/* Navegación */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-center">
                    <div>
                        {!isFirstStep && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={isSubmitting || (currentStep === 1 && isReceptionCompleted)}
                            >
                                ← Anterior
                            </Button>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        {!isLastStep ? (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleNext}
                                disabled={!canGoNext || isSubmitting}
                            >
                                Siguiente →
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting || !canSubmit}
                            >
                                {isSubmitting ? "Completando..." : "Completar Recepción"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Información de errores */}
                {Object.keys(formState.errors).length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            Hay errores en el formulario que deben corregirse antes de continuar
                        </p>
                    </div>
                )}
            </div>

            {/* Diálogo de confirmación */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Confirmar Recepción Final
                            </h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            ¿Confirma que desea proceder con la recepción de la transferencia? 
                            Esta acción registrará los productos en el inventario y <strong>no se puede deshacer</strong>.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowConfirmDialog(false)}
                                disabled={isReceiving}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleReceiveTransfer}
                                disabled={isReceiving}
                            >
                                {isReceiving ? "Recibiendo..." : "Confirmar Recepción"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}