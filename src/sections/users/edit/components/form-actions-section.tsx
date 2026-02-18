import { Button } from "@/components/button/button";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isSubmitting, onCancel }: FormActionsProps) => {
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  return (
    <div className="flex justify-end gap-4 pt-6">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onCancel}
        className="px-8"
      >
        Cancelar
      </Button>
      {hasUpdatePermission && (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-8 bg-primary hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? "Guardando..." : "Guardar Usuario"}
        </Button>
      )}
    </div>
  );
};
