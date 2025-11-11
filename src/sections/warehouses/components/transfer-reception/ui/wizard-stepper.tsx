import React from 'react';
import { WizardStep } from '@/sections/warehouses/hooks/useWizardNavigation';

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  isReceptionCompleted?: boolean;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  isReceptionCompleted = false,
}) => {
  // Validación de seguridad para evitar valores negativos
  const safeCurrentStep = Math.max(0, currentStep);
  const safeSteps = steps || [];

  if (safeSteps.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      {safeSteps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center cursor-pointer ${
              index <= safeCurrentStep ? "text-blue-600" : "text-gray-400"
            }`}
            onClick={() => onStepClick(index)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                index < safeCurrentStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : index === safeCurrentStep
                  ? "border-blue-600 text-blue-600 bg-white dark:bg-gray-800"
                  : "border-gray-300 text-gray-400 bg-white dark:bg-gray-800"
              }`}
            >
              {index < safeCurrentStep ? (
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
          {index < safeSteps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 ${
                index < safeCurrentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};