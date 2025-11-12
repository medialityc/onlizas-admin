"use client";
import { useEffect } from "react";
import { WizardHeader } from "./ui/wizard-header";
import { WizardStepper } from "./ui/wizard-stepper";
import { ValidationAlert } from "./ui/validation-alert";
import { WizardNavigation } from "./ui/wizard-navigation";
import { ConfirmationDialog } from "./ui/confirmation-dialog";
import { useFormContext } from "react-hook-form";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { validateReceptionStep } from "@/sections/warehouses/utils/receptionValidators";

// Hooks personalizados
import { useReceptionState } from "@/sections/warehouses/hooks/useReceptionState";
import { useDiscrepancyManagement } from "@/sections/warehouses/hooks/useDiscrepancyManagement";
import { useWizardNavigation } from "@/sections/warehouses/hooks/useWizardNavigation";
import { useReceptionOperations } from "@/sections/warehouses/hooks/useReceptionOperations";
// Componentes de pasos
import ProductReceptionTab from "./product-reception-tab";
import IncidentsManagementTab from "./incidents-management-tab";
import DocumentationTab from "./documentation-tab";
import { useRouter } from "next/navigation";


interface Props {
    transfer: WarehouseTransfer;
    isSubmitting: boolean;
    onSaveDraft: () => void;
    canCompleteReception?: () => boolean;
    onNavigateBack?: () => void;
    existingReception?: TransferReception | null;
    currentWarehouseId: string;
}

export default function TransferReceptionWizard({
    transfer,
    isSubmitting,
    onSaveDraft,
    canCompleteReception,
    onNavigateBack,
    existingReception,
    currentWarehouseId,
}: Props) {
    const { watch, formState } = useFormContext<CreateTransferReceptionFormData>();
    const items = watch("items");
    const router=useRouter()

    // Estados y hooks personalizados
    const receptionState = useReceptionState(existingReception);
    const discrepancyState = useDiscrepancyManagement();
    const wizardNavigation = useWizardNavigation(3);
    const receptionOperations = useReceptionOperations(
        transfer,
        receptionState.isReceiving,
        receptionState.receptionData,
        receptionState.setIsReceiving,
        receptionState.setReceptionData,
        receptionState.setIsReceptionCompleted
    );

    // Si hay recepción existente con discrepancias, ir automáticamente al paso de gestión de incidencias
    useEffect(() => {
        if (existingReception && ((existingReception as any).status === 'WithDiscrepancies' || existingReception.status === 'WITH_DISCREPANCY') && wizardNavigation.currentStep === 0) {
            wizardNavigation.setCurrentStep(1);
        }
    }, [existingReception, wizardNavigation]);

    // Determinar el paso inicial basado en la recepción existente
    const getInitialStep = () => {
        if (existingReception) {
            const hasDiscrepancies = (existingReception as any).status === 'WithDiscrepancies';
            return hasDiscrepancies ? 1 : 2; // Paso 1 para incidencias, paso 2 para documentación
        }
        return 0; // Paso 0 para recepción inicial
    };

    // Usar el paso inicial determinado
    useEffect(() => {
        const initialStep = getInitialStep();
        if (wizardNavigation.currentStep !== initialStep) {
            wizardNavigation.setCurrentStep(initialStep);
        }
    }, [existingReception]);

    // Validaciones
    const validateReceptionStepWrapper = () => validateReceptionStep(transfer, items);
    const validateIncidentsStep = () => true; // Opcional
    const validateDocumentationStep = () => true; // Opcional

    // Configuración de pasos
    const steps = [
        {
            id: "reception",
            title: "Recepción de Productos",
            description: "Verifica las cantidades recibidas y reporta incidencias",
            component: (
                <ProductReceptionTab
                    transfer={transfer}
                    isSubmitting={isSubmitting || receptionState.isReceiving}
                    onSaveDraft={onSaveDraft}
                    canCompleteReception={canCompleteReception}
                    receptionData={receptionState.receptionData}
                    isReceptionCompleted={receptionState.isReceptionCompleted}
                />
            ),
            isValid: validateReceptionStepWrapper,
        },
        {
            id: "incidents",
            title: "Gestión de Incidencias",
            description: "Revisa y gestiona las incidencias reportadas",
            component: (
                <IncidentsManagementTab 
                    transfer={transfer} 
                    receptionId={existingReception?.id} 
                    receptionData={existingReception} 
                    setData={receptionState.setReceptionData}
                    currentWarehouseId={currentWarehouseId}
                />
            ),
            isValid: validateIncidentsStep,
            isOptional: true,
        },
        {
            id: "documentation",
            title: "Documentación",
            description: "Adjunta evidencia y documentación adicional",
            component: (
                <DocumentationTab 
                    transfer={transfer} 
                    receptionData={existingReception} 
                />
            ),
            isValid: validateDocumentationStep,
            isOptional: true,
        },
    ];

    // Handlers
    const handleConfirmReception = async () => {
        wizardNavigation.setShowConfirmDialog(false);
        
        // Si ya existe una recepción, no intentar crearla de nuevo
        if (existingReception) {
            const hasDiscrepancies = (existingReception as any).status === 'WithDiscrepancies';
            wizardNavigation.setCurrentStep(hasDiscrepancies ? 1 : 2);
            return;
        }

        const result = await receptionOperations.handleReceiveTransfer();
        
        if (result.success) {
            // Verificar si hay discrepancias en los items del formulario
            const hasDiscrepancies = items.some((item: any) => 
                item.discrepancyType && item.discrepancyType !== null
            ) || (existingReception && (existingReception as any).status === 'WithDiscrepancies');
        } 
    };

    const handleNextWithValidation = (event?: React.MouseEvent) => {
        if (wizardNavigation.currentStep === 0 && !receptionState.receptionData?.id) {
            wizardNavigation.handleNext(event, () => wizardNavigation.setShowConfirmDialog(true));
        } else {
            wizardNavigation.handleNext(event);
        }
    };

    const handleStepClickWithValidation = (stepIndex: number) => {
        const canNavigateBack = !(stepIndex === 0 && receptionState.isReceptionCompleted && wizardNavigation.currentStep > 0);
        const isStepValid = wizardNavigation.canGoNext(steps);
        wizardNavigation.handleStepClick(stepIndex, canNavigateBack, isStepValid);
    };

    const handlePreviousWithValidation = () => {
        const canGoBack = !(wizardNavigation.currentStep === 1 && receptionState.isReceptionCompleted);
        wizardNavigation.handlePrevious(canGoBack);
    };

    const currentStepData = steps[wizardNavigation.currentStep];
    const canGoNext = wizardNavigation.canGoNext(steps);
    const canSubmit = wizardNavigation.isLastStep && (canCompleteReception ? canCompleteReception() : true);

    return (
        <div className="space-y-6">
            {/* Header de progreso */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                <WizardHeader
                    transferId={transfer.id}
                    receptionId={receptionState.receptionData?.id}
                    currentStep={wizardNavigation.currentStep}
                    totalSteps={steps.length}
                />

                <WizardStepper
                    steps={steps}
                    currentStep={wizardNavigation.currentStep}
                    onStepClick={handleStepClickWithValidation}
                    isReceptionCompleted={receptionState.isReceptionCompleted}
                />

                <ValidationAlert
                    currentStep={wizardNavigation.currentStep}
                    show={!canGoNext && !!currentStepData.isValid}
                />
            </div>

            {/* Contenido del paso actual */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {currentStepData.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {currentStepData.description}
                    </p>
                </div>
                <div className="p-4 sm:p-6">
                    {currentStepData.component}
                </div>
            </div>

            {/* Navegación */}
            <WizardNavigation
                isFirstStep={wizardNavigation.isFirstStep}
                isLastStep={wizardNavigation.isLastStep}
                canGoNext={canGoNext}
                isSubmitting={isSubmitting}
                canSubmit={canSubmit}
                canGoBack={!(wizardNavigation.currentStep === 1 && receptionState.isReceptionCompleted)}
                onPrevious={handlePreviousWithValidation}
                onNext={handleNextWithValidation}
                hasErrors={Object.keys(formState.errors).length > 0}
            />

            {/* Diálogo de confirmación */}
            <ConfirmationDialog
                show={wizardNavigation.showConfirmDialog}
                isLoading={receptionState.isReceiving}
                title="Confirmar Recepción Final"
                message="¿Confirma que desea proceder con la recepción de la transferencia? Esta acción registrará los productos en el inventario y <strong>no se puede deshacer</strong>."
                confirmText="Confirmar Recepción"
                onConfirm={handleConfirmReception}
                onCancel={() => wizardNavigation.setShowConfirmDialog(false)}
            />
        </div>
    );
}