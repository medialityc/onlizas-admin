import React from 'react';

interface WizardHeaderProps {
  transferId: string;
  receptionId?: string;
  currentStep: number;
  totalSteps: number;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  transferId,
  receptionId,
  currentStep,
  totalSteps,
}) => {
  // Validación de seguridad para evitar valores negativos
  const safeCurrentStep = Math.max(0, currentStep);
  const safeTotalSteps = Math.max(1, totalSteps);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Transferencia Id: {transferId}
        </div>
        {receptionId && (
          <div className="text-lg text-green-600 dark:text-green-400 font-medium">
            Recepción ID: {receptionId}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Paso {safeCurrentStep + 1} de {safeTotalSteps}
      </div>
    </div>
  );
};