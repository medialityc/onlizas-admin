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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
      <div className="min-w-0 flex-1">
        <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          Transferencia: {transferId}
        </div>
        {receptionId && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium truncate">
            Recepción: {receptionId}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 sm:text-right shrink-0">
        Paso {safeCurrentStep + 1} de {safeTotalSteps}
      </div>
    </div>
  );
};