import IconSettings from "@/components/icon/icon-settings";
import InventoryVariantFrom from "../inventory-variant-from/inventory-variant-from";
import LoaderButton from "@/components/loaders/loader-button";
import { useFormContext } from "react-hook-form";

type Props = {
  index?: number;
  onDelete: () => void;
  onRemove: () => void;
  isPending: boolean;
  isPacking: boolean;
  deleteLoading?: boolean;
};

const InventoryEditVariantContent = ({
  index,
  onDelete,
  onRemove,
  isPending,
  isPacking,
  deleteLoading,
}: Props) => {
  const {
    formState: { isDirty, isValid },
  } = useFormContext();

  return (
    <div>
      <div className="flex gap-4 pb-6 mb-6 border-b justify-between">
        <h3 className="text-lg font-semibold text-gray-900 my-4 flex items-center dark:text-gray-100">
          <IconSettings className="mr-2 w-5 h-5" /> Configuración del inventario
        </h3>
        <div className="flex gap-4">
          <LoaderButton
            className="h-8"
            type="submit"
            loading={isPending}
            // disabled={!isDirty }
          >
            Guardar
          </LoaderButton>
        </div>
      </div>
      <div className="gap-2">
        <InventoryVariantFrom
          variantIndex={index ?? 0}
          onDelete={onDelete}
          onRemove={onRemove}
          isPacking={isPacking}
          deleteLoading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default InventoryEditVariantContent;
