import React, { HTMLAttributes } from "react";

import Badge from "@/components/badge/badge";
import { StoreCategory } from "@/types/store-categories";


type Props = {
  category: StoreCategory;
  onToggleActive: (id: number, checked: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
} & HTMLAttributes<HTMLDivElement>;

export default function CategoryListItem({ category: c, onToggleActive, onEdit, onDelete, ...dndProps }: Props) {
  return (
    <div
      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all select-none hover:bg-gray-50/60 cursor-grab active:cursor-grabbing"
      {...dndProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 font-bold text-lg cursor-grab active:cursor-grabbing select-none">≡</div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-medium font-semibold text-gray-900">{c.categoryName}</h4>
              {c.isActive && (
                <Badge variant="outline-primary" className="!text-[11px] !px-2 !py-0.5" rounded>
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
            <button
              type="button"
              aria-label="Cambiar estado"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.isActive ? "bg-gradient-to-r from-secondary to-indigo-600" : "bg-gray-300"}`}
              onClick={() => onToggleActive(c.id, !c.isActive)}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${c.isActive ? "translate-x-5" : "translate-x-1"}`}
              />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
