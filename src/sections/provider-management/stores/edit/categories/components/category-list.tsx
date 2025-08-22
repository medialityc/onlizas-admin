"use client";

import React, { useRef } from "react";
import type { StoreCategory } from "../mock";
import { CategoryListItem } from "./index";
import { persistCategoryOrder } from "../mock";

type Props = {
  items: StoreCategory[];
  onItemsChange: (next: StoreCategory[]) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function CategoryList({
  items,
  onItemsChange,
  onEdit,
  onDelete,
}: Props) {
  // refs to DOM nodes for FLIP animation
  const nodeRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  const measureRects = () => {
    const map = new Map<number, DOMRect>();
    nodeRefs.current.forEach((el, id) => {
      if (el) map.set(id, el.getBoundingClientRect());
    });
    return map;
  };

  return (
    <div className="space-y-3">
      {items.map((c, idx) => (
        <div
          key={c.id}
          ref={(el) => {
            // store ref without returning the Map (avoid non-void return type)
            nodeRefs.current.set(c.id, el ?? null);
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
            onToggleActive={(id, checked) =>
              onItemsChange(
                items.map((x) =>
                  x.id === id ? { ...x, isActive: checked } : x
                )
              )
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
                  const el = nodeRefs.current.get(item.id) as
                    | HTMLDivElement
                    | undefined
                    | null;
                  const prev = prevRects.get(item.id);
                  const after = nextRects.get(item.id);
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

              // persist tentative order (idx + 1)
              const ordered = next.map((c, i) => ({ ...c, order: i + 1 }));
              await persistCategoryOrder(ordered);
            }}
          />
        </div>
      ))}
    </div>
  );
}
