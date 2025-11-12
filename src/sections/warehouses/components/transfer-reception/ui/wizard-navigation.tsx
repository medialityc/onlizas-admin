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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="w-full sm:w-auto order-2 sm:order-1">
          {!isFirstStep && (
            <Button
              type="button"
              variant="secondary"
              onClick={onPrevious}
              disabled={isSubmitting || !canGoBack}
              className="w-full sm:w-auto"
            >
              ← Anterior
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
          {!isLastStep ? (
            <Button
              type="button"
              variant="primary"
              onClick={onNext}
              disabled={!canGoNext || isSubmitting}
              className="w-full sm:w-auto"
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
              className="w-full sm:w-auto"
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