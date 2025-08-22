"use client";

import React from "react";
import type { StoreCategory } from "../mock";
import { CategoryListItem } from "./index";
import { persistCategoryOrder } from "../mock";

type Props = {
  items: StoreCategory[];
  onItemsChange: (next: StoreCategory[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function CategoryList({ items, onItemsChange, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {items.map((c, idx) => (
        <CategoryListItem
          key={c.id}
          category={c}
          onToggleActive={(id, checked) =>
            onItemsChange(items.map((x) => (x.id === id ? { ...x, isActive: checked } : x)))
          }
          onEdit={onEdit}
          onDelete={onDelete}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", String(idx));
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={async (e) => {
            e.preventDefault();
            const fromIndex = Number(e.dataTransfer.getData("text/plain"));
            const toIndex = idx;
            if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;
            const next = [...items];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            onItemsChange(next);
            // persist tentative order (idx + 1)
            const ordered = next.map((c, i) => ({ ...c, order: i + 1 }));
            await persistCategoryOrder(ordered);
          }}
        />
      ))}
    </div>
  );
}
