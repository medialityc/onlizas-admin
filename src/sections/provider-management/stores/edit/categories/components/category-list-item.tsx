import React, { HTMLAttributes } from "react";
import Badge from "@/components/badge/badge";
import { StoreCategory } from "@/types/store-categories";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

type Props = {
  category: StoreCategory;
  onToggleActive: (id: string | number, checked: boolean) => void;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
} & HTMLAttributes<HTMLDivElement>;

export default function CategoryListItem({
  category: c,
  onToggleActive,
  onEdit,
  onDelete,
  ...dndProps
}: Props) {
  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all select-none hover:bg-gray-50/60 dark:hover:bg-gray-700/60 cursor-grab active:cursor-grabbing"
      {...dndProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-500 font-bold text-lg cursor-grab active:cursor-grabbing select-none">
            ≡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-medium font-semibold text-gray-900 dark:text-gray-100">
                {c.categoryName}
              </h4>
              {c.active && (
                <Badge
                  variant="outline-primary"
                  className="!text-[11px] !px-2 !py-0.5"
                  rounded
                >
                  Activa
                </Badge>
              )}
            </div>
            {/* {c.description && (
              <p className="text-sm text-gray-500">{c.description}</p>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {c.productCount} productos · {c.views} visitas
            </div> */}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[3rem]">
            {hasUpdatePermission && (
              <button
                type="button"
                aria-label="Cambiar estado"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.active ? "bg-gradient-to-r from-secondary to-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}
                onClick={() => onToggleActive(c.id, !c.active)}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${c.active ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
