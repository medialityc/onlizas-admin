import InventoryVariantFrom from "../inventory-variant-from/inventory-variant-from";
import LoaderButton from "@/components/loaders/loader-button";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button/button";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

type Props = {
  index?: number;
  isPending: boolean;
  isPacking: boolean;
  handleClose: () => void;
};

const InventoryEditVariantContent = ({
  index,
  handleClose,
  isPending,
  isPacking,
}: Props) => {
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.UPDATE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);

  return (
    <>
      <div className="gap-2">
        <InventoryVariantFrom variantIndex={index ?? 0} isPacking={isPacking} />
        <div className="flex justify-end gap-3 pt-6">
          <Button
            outline
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          {hasUpdatePermission && (
            <LoaderButton
              type="submit"
              loading={isPending}
              className="btn btn-primary"
            >
              Guardar
            </LoaderButton>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryEditVariantContent;
