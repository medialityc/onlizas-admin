"use client";
import React from "react";
import ImagePreview from "@/components/image/image-preview";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Edit2, Trash2 } from "lucide-react";
import { getVariantConditionLabel } from "@/config/variant-condition-map";
import { ProductVariant } from "../../schemas/inventory-provider.schema";
import { Tooltip } from "@mantine/core";

export interface VariantCardProps {
  variant: ProductVariant;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

const conditionColorMap: Record<number, string> = {
  6: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800", // Nuevo
  7: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800", // Reacondicionado
  1: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  2: "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800",
  3: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
  4: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  5: "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700",
};

function VariantCard({
  variant,
  onEdit,
  onDelete,
  canDelete,
}: VariantCardProps) {
  const details =
    (variant.details as unknown as { key: string; value: string }[]) || [];
  const MAX_VISIBLE_DETAILS = 4;
  const visibleDetails = details.slice(0, MAX_VISIBLE_DETAILS);
  const hiddenCount = details.length - visibleDetails.length;

  return (
    <div className="group relative rounded-xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-[#f4f8fe] via-white to-[#f4f8fe] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/70 shadow-sm hover:shadow-md hover:border-blue-200/70 dark:hover:border-blue-400/40 transition duration-200 ease-out hover:-translate-y-0.5">
      {/* Header */}
      <div className="relative pt-3 px-3">
        <div className="flex gap-3">
          <ImagePreview
            alt={variant.id || "variant"}
            images={(variant.images as string[]) || []}
            previewEnabled
            className="w-20 h-20 rounded-md ring-1 ring-gray-200 dark:ring-slate-700 bg-white dark:bg-slate-800"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate tracking-tight">
                {variant.productName}
              </h3>
              <Badge
                variant={
                  variant.isActive ? "outline-success" : "outline-secondary"
                }
                className="text-[10px] font-medium"
              >
                {variant.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            <div className="mt-0.5 flex flex-col gap-1 text-[11px] text-gray-600 dark:text-gray-300">
              <span className="font-mono">SKU: {variant.sku || "-"}</span>
              <span className="font-mono">UPC: {variant.upc || "-"}</span>
              <span className="font-mono">EAN: {variant.ean || "-"}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1 items-center">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${
                  conditionColorMap[variant.condition] || conditionColorMap[5]
                }`}
              >
                {getVariantConditionLabel(variant.condition)}
              </span>
              {variant.isPrime && (
                <Badge variant="outline-warning" className="text-[10px]">
                  Prime
                </Badge>
              )}
              {variant.isLimit && (
                <Badge variant="outline-danger" className="text-[10px]">
                  Limite {variant.purchaseLimit}
                </Badge>
              )}
              {variant.packageDelivery && (
                <Badge variant="outline-secondary" className="text-[10px]">
                  Paquetería
                </Badge>
              )}
              {variant?.warranty?.isWarranty && (
                <Badge variant="outline-success" className="text-[10px]">
                  Garantía {variant.warranty?.warrantyTime}m
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 pb-3 pt-2 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-3 text-xs bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm rounded-lg p-2 border border-white/60 dark:border-slate-700/40 shadow-[0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-none">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Stock
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
              {variant.stock}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Precio
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
              ${variant.price.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Compras
            </span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 text-sm">
              {variant.isLimit ? variant.purchaseLimit : "Ilimitado"}
            </span>
          </div>
          {variant?.warranty?.isWarranty && (
            <div className="flex flex-col gap-0.5 col-span-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Garantía
              </span>
              <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400 text-xs">
                {variant.warranty?.warrantyTime}m / $
                {variant.warranty?.warrantyPrice.toFixed(2)}
              </span>
            </div>
          )}
          {variant.packageDelivery && (
            <div className="flex flex-col gap-0.5 col-span-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Paquetería
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs">
                {variant.volume ?? "-"}v / {variant.weight ?? "-"}w
              </span>
            </div>
          )}
        </div>

        {/* Características con tooltips */}
        {visibleDetails.length > 0 && (
          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
            {visibleDetails.map((detail) => (
              <Tooltip
                key={detail.key}
                label={`${detail.key}: ${detail.value}`}
                withArrow
              >
                <Badge
                  variant="outline-secondary"
                  className="text-[10px] font-normal max-w-[120px] truncate cursor-help hover:border-blue-300/60 dark:hover:border-blue-400/50 transition-colors"
                >
                  {detail.key}: {detail.value}
                </Badge>
              </Tooltip>
            ))}
            {hiddenCount > 0 && (
              <Tooltip
                label={details
                  .slice(MAX_VISIBLE_DETAILS)
                  .map((d) => `${d.key}: ${d.value}`)
                  .join("\n")}
                withArrow
              >
                <Badge
                  variant="outline-info"
                  className="text-[10px] cursor-help"
                >
                  +{hiddenCount} más
                </Badge>
              </Tooltip>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
          <Button
            outline
            variant="info"
            size="sm"
            onClick={() => onEdit(variant.id as string)}
            className="gap-1 px-2 py-1 rounded-md flex items-center"
            title="Editar variante"
            aria-label={`Editar variante ${variant.sku ?? variant.productName}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Editar</span>
          </Button>
          {canDelete && onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(variant.id as string)}
              className="gap-1 px-2 py-1 rounded-md flex items-center"
              title="Eliminar variante"
              aria-label={`Eliminar variante ${variant.sku ?? variant.productName}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Eliminar</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VariantCard;
