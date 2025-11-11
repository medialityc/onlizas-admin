"use client";
import { WizardHeader } from "./ui/wizard-header";
import { WizardStepper } from "./ui/wizard-stepper";
import { ValidationAlert } from "./ui/validation-alert";
import { WizardNavigation } from "./ui/wizard-navigation";
import { ConfirmationDialog } from "./ui/confirmation-dialog";
import { useFormContext } from "react-hook-form";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
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
}

export default function TransferReceptionWizard({
    transfer,
    isSubmitting,
    onSaveDraft,
    canCompleteReception,
    onNavigateBack,
}: Props) {
    const { watch, formState } = useFormContext<CreateTransferReceptionFormData>();
    const items = watch("items");
    const router=useRouter()

    // Estados y hooks personalizados
    const receptionState = useReceptionState();
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
                    receptionId={receptionState.receptionData?.id} 
                    receptionData={receptionState.receptionData} 
                    setData={receptionState.setReceptionData}
                    resolvedDiscrepancies={discrepancyState.resolvedDiscrepancies}
                    permanentlyResolvedDiscrepancies={discrepancyState.permanentlyResolvedDiscrepancies}
                    setResolvedDiscrepancies={discrepancyState.setResolvedDiscrepancies}
                    setPermanentlyResolvedDiscrepancies={discrepancyState.setPermanentlyResolvedDiscrepancies}
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
                    receptionData={receptionState.receptionData} 
                />
            ),
            isValid: validateDocumentationStep,
            isOptional: true,
        },
    ];

    // Handlers
    const handleConfirmReception = async () => {
        wizardNavigation.setShowConfirmDialog(false);
        
        // Crear una recepción inventada temporalmente para poder avanzar
       /*  const fakeReception = {
            id: "019a6e10-243c-7212-ac16-55c7358d338e",
            transferId: transfer.id,
            status: 'completed',
            createdAt: new Date().toISOString(),
            receivedAt: new Date().toISOString(),
            hasDiscrepancies: false,
            items: transfer.items?.map(item => ({
                ...item,
                quantityReceived: item.quantityRequested,
                receivedBatch: null,
                discrepancyType: null,
                discrepancyNotes: '',
                isAccepted: true
            })) || [],
            unexpectedProducts: [],
            notes: '',
            comments: []
        };

        // Simular un delay como si fuera una llamada real
        receptionState.setIsReceiving(true);
        
        setTimeout(() => {
            receptionState.setReceptionData(fakeReception);
            receptionState.setIsReceptionCompleted(true);
            receptionState.setIsReceiving(false);
            wizardNavigation.setCurrentStep(1);
        }, 1000); */

        // TODO: Reemplazar con la llamada real cuando esté lista
         const result = await receptionOperations.handleReceiveTransfer();
        
        if (result.success) {
            // Verificar si hay discrepancias en los items del formulario
            const hasDiscrepancies = items.some((item: any) => 
                item.discrepancyType && item.discrepancyType !== null
            );
            if (!hasDiscrepancies) {
                router.back()
            } else {
                // Si hay discrepancias, ir al paso de gestión de incidencias
                wizardNavigation.setCurrentStep(1);
            }
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
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
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