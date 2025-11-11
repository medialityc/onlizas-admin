import { useState, useCallback } from 'react';
import showToast from '@/config/toast/toastConfig';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  isValid?: () => boolean;
  isOptional?: boolean;
}

export interface UseWizardNavigationReturn {
  currentStep: number;
  showConfirmDialog: boolean;
  setCurrentStep: (step: number) => void;
  setShowConfirmDialog: (show: boolean) => void;
  handleNext: (event?: React.MouseEvent, onConfirmRequired?: () => void) => void;
  handlePrevious: (canGoBack?: boolean) => void;
  handleStepClick: (stepIndex: number, canNavigateBack?: boolean, isStepValid?: boolean) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: (steps: WizardStep[]) => boolean;
}

export const useWizardNavigation = (totalSteps: number): UseWizardNavigationReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const canGoNext = useCallback((steps: WizardStep[]) => {
    const currentStepData = steps[currentStep];
    return currentStepData?.isValid ? currentStepData.isValid() : true;
  }, [currentStep]);

  const handleNext = useCallback((event?: React.MouseEvent, onConfirmRequired?: () => void) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (onConfirmRequired) {
      onConfirmRequired();
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback((canGoBack: boolean = true) => {
    if (!canGoBack) {
      showToast("No puede regresar al paso anterior una vez completada la recepción", "warning");
      return;
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback((stepIndex: number, canNavigateBack: boolean = true, isStepValid: boolean = true) => {
    if (stepIndex === 0 && !canNavigateBack && currentStep > 0) {
      showToast("No puede modificar la recepción una vez completada", "warning");
      return;
    }

    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
    } else if (stepIndex === currentStep + 1 && isStepValid) {
      setCurrentStep(stepIndex);
    }
  }, [currentStep]);

  return {
    currentStep,
    showConfirmDialog,
    setCurrentStep,
    setShowConfirmDialog,
    handleNext,
    handlePrevious,
    handleStepClick,
    isFirstStep,
    isLastStep,
    canGoNext,
  };
};