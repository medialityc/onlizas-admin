import { Button } from "@/components/button/button";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";


interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions = ({ isSubmitting, onCancel }: FormActionsProps) => {
  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasUpdatePermission = hasPermission(["UPDATE_ALL"]);

  return (
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
