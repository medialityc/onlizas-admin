import { Button } from '@/components/button/button';
import { useRouter } from 'next/navigation';


interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  canGoBack?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  hasErrors?: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  isFirstStep,
  isLastStep,
  canGoNext,
  isSubmitting,
  canSubmit,
  canGoBack = true,
  onPrevious,
  onNext,
  hasErrors = false,
}) => {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="secondary"
              onClick={onPrevious}
              disabled={isSubmitting || !canGoBack}
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
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
            >
              Siguiente →
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                router.back();
              }}
              disabled={isSubmitting}
            >
              Completar
            </Button>
          )}
        </div>
      </div>

      {hasErrors && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            Hay errores en el formulario que deben corregirse antes de continuar
          </p>
        </div>
      )}
    </div>
  );
};