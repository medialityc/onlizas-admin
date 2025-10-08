import { Button } from "@/components/button/button";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { usePermissions } from "@/hooks/use-permissions";

type Props = {
  features?: any[];
  handleAddVariant?: () => void;
};
const EditHeader = ({ features, handleAddVariant }: Props) => {
  const { hasPermission } = usePermissions();
  const hasCreatePermission = hasPermission([PERMISSION_ENUM.CREATE]);

  return (
    <div className="mt-1 flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-2 items-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          Variantes del producto
        </h3>
        {hasCreatePermission && (
          <Button
            disabled={features?.length === 0}
            variant="secondary"
            onClick={handleAddVariant}
          >
            <PlusIcon className="h-4 w-4" />
            Agregar variante
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditHeader;
