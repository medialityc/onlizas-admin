"use client";
import { Plus } from "lucide-react";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { Button } from "@/components/button/button";
import { useInventoryVariantDelete } from "../../hooks/use-inventory-variant-delete";
import DeleteDialog from "@/components/modal/delete-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useToggle } from "@/hooks/use-toggle";
import { useState } from "react";
import VariantCard from "../variant-card/variant-card";

type Props = {
  inventoryId: string;
  variants: ProductVariant[];
  onAdd: () => void;
  onEdit: (variantId: string) => void;
};

export default function VariantsManager({
  onEdit,
  onAdd,
  variants,
  inventoryId,
}: Props) {
  const { onDelete, isPending: isDeleting } = useInventoryVariantDelete(
    inventoryId as string
  );
  const { hasPermission } = usePermissions();
  const hasDeletePermission = hasPermission([
    PERMISSION_ENUM.DELETE,
    PERMISSION_ENUM.DELETE_VARIANT,
  ]);
  const hasCreatePermission = hasPermission([
    PERMISSION_ENUM.CREATE_VARIANT,
    PERMISSION_ENUM.CREATE,
  ]);
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.UPDATE_VARIANT,
    PERMISSION_ENUM.UPDATE,
  ]);
  const { open, onOpen, onClose } = useToggle(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  const handleDelete = (variantId: string) => {
    setSelectedVariantId(variantId);
    onOpen();
  };

  console.log(variants);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Variantes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {variants.length} {variants.length === 1 ? "variante" : "variantes"}
          </p>
        </div>
        {hasCreatePermission && (
          <Button
            variant="secondary"
            onClick={onAdd}
            className="gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar variante</span>
            <span className="sm:hidden">Agregar</span>
          </Button>
        )}
      </div>

      {/* Grid de variantes */}
      {variants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {variants.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              canEdit={hasUpdatePermission}
              onEdit={onEdit}
              canDelete={hasDeletePermission}
              onDelete={(id) => handleDelete(id)}
            />
          ))}
        </div>
      ) : (
        /* Estado vacío */
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            No hay variantes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Crea tu primera variante para comenzar
          </p>
          {hasCreatePermission && (
            <Button onClick={onAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              Crear variante
            </Button>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        onClose={onClose}
        open={open}
        onConfirm={() =>
          selectedVariantId && onDelete?.(selectedVariantId).then(onClose)
        }
        loading={isDeleting}
      />
    </div>
  );
}
