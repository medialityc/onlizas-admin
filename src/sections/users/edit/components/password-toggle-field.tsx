import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

interface PasswordToggleFieldProps {
  enablePasswordEdit: boolean;
  setEnablePasswordEdit: (value: boolean) => void;
  control: any;
}

export const PasswordToggleField = ({
  enablePasswordEdit,
  setEnablePasswordEdit,
  control,
}: PasswordToggleFieldProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Button
        type="button"
        leftIcon={<LockClosedIcon className="h-4 w-4" />}
        size="sm"
        onClick={() => {
          if (enablePasswordEdit) {
            control.setValue("password", undefined);
          }
          setEnablePasswordEdit(!enablePasswordEdit);
        }}
        className="flex items-center gap-2 w-full"
      >
        {enablePasswordEdit ? "Cancelar cambio" : "Cambiar contraseña"}
      </Button>
    </div>

    {enablePasswordEdit && (
      <div className="relative">
        <RHFInputWithLabel
          name="password"
          label="Contraseña"
          placeholder="Introduzca la nueva contraseña"
          type="password"
        />
      </div>
    )}
  </div>
);
