"use client";

import React, { useRef } from "react";
import CategoryListItem from "./category-list-item";
import CategoryListSkeleton from "./category-list-skeleton";
import { StoreCategory } from "@/types/store-categories";

type Props = {
  items: StoreCategory[];
  onItemsChange: (next: StoreCategory[]) => void;
  onToggle?: (id: number, checked: boolean) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  loading: boolean;
};

export default function CategoryList({
  items,
  onItemsChange,
  onToggle,
  onEdit,
  onDelete,
  loading,
}: Props) {

  if (loading) return <CategoryListSkeleton />;

  const nodeRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  const measureRects = () => {
    const map = new Map<number, DOMRect>();
    nodeRefs.current.forEach((el, id) => {
      if (el) map.set(id, el.getBoundingClientRect());
    });
    return map;
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-6 border rounded-md bg-white text-center text-sm text-gray-500">
        No hay categorías para mostrar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((c, idx) => (
        <div
          key={c.categoryId}
          ref={(el) => {
            // store ref without returning the Map (avoid non-void return type)
            nodeRefs.current.set(c.categoryId, el ?? null);
            return;
          }}
          // keep transform transitions inline to avoid adding global css
          style={{
            transition: "transform 220ms ease",
            willChange: "transform",
          }}
        >
          <CategoryListItem
            category={c}
            onToggleActive={(id: number, checked: boolean) => {
              // Optimistic local change
              onItemsChange(items.map((x) => (x.categoryId === id ? { ...x, isActive: checked } : x)));
              onToggle?.(id, checked);
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            draggable
            onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
              e.dataTransfer.setData("text/plain", String(idx));
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
            onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              const fromIndex = Number(e.dataTransfer.getData("text/plain"));
              const toIndex = idx;
              if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;

              // FLIP: measure before
              const prevRects = measureRects();

              const next = [...items];
              const [moved] = next.splice(fromIndex, 1);
              next.splice(toIndex, 0, moved);

              // update parent state
              onItemsChange(next);

              // measure after in next frame and animate
              requestAnimationFrame(() => {
                const nextRects = measureRects();
                next.forEach((item) => {
                  const el = nodeRefs.current.get(item.categoryId) as
                    | HTMLDivElement
                    | undefined
                    | null;
                  const prev = prevRects.get(item.categoryId);
                  const after = nextRects.get(item.categoryId);
                  if (el && prev && after) {
                    const deltaY = prev.top - after.top;
                    if (deltaY) {
                      // apply inverse transform
                      el.style.transform = `translateY(${deltaY}px)`;
                      // force reflow then animate to zero
                      requestAnimationFrame(() => {
                        el.style.transform = "";
                      });
                      // cleanup inline transition after finished
                      const onEnd = () => {
                        el.style.transition = "";
                        el.removeEventListener("transitionend", onEnd);
                      };
                      el.addEventListener("transitionend", onEnd);
                    }
                  }
                });
              });

              // No persist here; parent must click "Guardar orden"
            }}
          />
        </div>
      ))}
    </div>
  );
}

// Skeleton moved to a shared component
