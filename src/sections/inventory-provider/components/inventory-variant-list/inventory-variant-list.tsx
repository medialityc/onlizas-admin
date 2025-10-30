"use client";
import { Edit2, Trash2, Plus, Image, ImageIcon } from "lucide-react";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { Button } from "@/components/button/button";
import { useInventoryVariantDelete } from "../../hooks/use-inventory-variant-delete";
import DeleteDialog from "@/components/modal/delete-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useToggle } from "@/hooks/use-toggle";
import ImagePreview from "@/components/image/image-preview";
import { useState } from "react";
import Badge from "@/components/badge/badge";

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
  const hasDeletePermission = hasPermission([PERMISSION_ENUM.DELETE]);
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
        <Button
          variant="secondary"
          onClick={onAdd}
          className="gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Agregar variante</span>
          <span className="sm:hidden">Agregar</span>
        </Button>
      </div>

      {/* Grid de variantes */}
      {variants.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50"
            >
              {/* Imagen y estado */}
              <div className="relative h-24 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                <div className="flex flex-row gap-2 p-2">
                  <ImagePreview
                    alt={variant?.id || "variant"}
                    images={(variant?.images as string[]) || []}
                    previewEnabled
                    className="w-20 h-20  "
                  />
                  <div className="flex flex-col ">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate ">
                      {variant.productName}
                    </h3>
                    <p className=" text-gray-900 dark:text-white truncate ">
                      SKU: {variant.sku || "Sin SKU"}
                    </p>

                    <div className="flex flex-row gap-1 flex-wrap">
                      {(
                        variant?.details as unknown as {
                          key: string;
                          value: string;
                        }[]
                      )?.map((detail: { key: string; value: string }) => (
                        <Badge key={detail?.key} variant="outline-secondary">
                          {detail?.key}: {detail?.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badge de estado */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      variant.isActive
                        ? "bg-green-500/90 text-white"
                        : "bg-gray-500/90 text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {variant.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4">
                {/* Detalles en grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Stock
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {variant.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Precio
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${variant.price.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Límite de compras
                    </p>
                    {}
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {variant.purchaseLimit || "ilimitado"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Paquetería
                    </p>
                    <p
                      className={`font-semibold ${
                        variant.isPacking
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {variant.isPacking ? (
                        <Badge variant="success">Si</Badge>
                      ) : (
                        <Badge variant="danger">No</Badge>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Entrega express
                    </p>
                    <p
                      className={`font-semibold ${
                        variant.isPrime
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {variant.isPrime ? (
                        <Badge variant="success">Si</Badge>
                      ) : (
                        <Badge variant="danger">No</Badge>
                      )}
                    </p>
                  </div>
                  {variant?.warranty?.isWarranty && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Garantía
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${variant.warranty?.warrantyPrice.toFixed(2)}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {variant.warranty?.warrantyTime} meses
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Button
                      outline
                      variant="info"
                      size="sm"
                      onClick={() => onEdit(variant.id as string)}
                      className="gap-2 px-3 py-1.5 rounded-md flex items-center transition"
                      title="Editar variante"
                      aria-label={`Editar variante ${variant.sku ?? variant.productName}`}
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden md:inline">Editar</span>
                    </Button>

                    {hasDeletePermission && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(variant.id as string)}
                        className="gap-2 px-3 py-1.5 rounded-md flex items-center transition"
                        title="Eliminar variante"
                        aria-label={`Eliminar variante ${variant.sku ?? variant.productName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:inline">Eliminar</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
          <Button onClick={onAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Crear variante
          </Button>
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
