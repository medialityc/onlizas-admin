import { Button } from "@/components/button/button";


interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isSubmitting, onCancel }: FormActionsProps) => (
  <div className="flex justify-end gap-4 pt-6">
    <Button
      type="button"
      outline
      variant="secondary"
      size="lg"
      onClick={onCancel}
      className="px-8"
    >
      Cancelar
    </Button>
    <Button
      type="submit"
      disabled={isSubmitting}
      className="px-8 bg-primary hover:from-blue-700 hover:to-purple-700"
    >
      {isSubmitting ? "Guardando..." : "Guardar Usuario"}
    </Button>
  </div>
);
