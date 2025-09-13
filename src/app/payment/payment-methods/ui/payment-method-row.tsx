// components/PaymentMethodRow.tsx
"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge, Button, Switch } from "@mantine/core";
import { GripVertical, Settings } from "lucide-react";
import { PaymentMethod } from "../../interfaces";

type Props = {
  method: PaymentMethod;
  onToggleEnabled: (id: string) => void;
};

export function PaymentMethodRow({ method, onToggleEnabled }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: method.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-900 cursor-default">
        <div className="flex items-center space-x-4">
          {/* Drag handle: only here aplican listeners/attributes para evitar conflictos con inputs */}
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab inline-flex items-center p-1"
            aria-label={`Drag ${method.name}`}
            type="button"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </button>

          <Switch
            checked={method.enabled}
            onChange={() => onToggleEnabled(method.id)}
            aria-label={`Enable ${method.name}`}
          />

          <div>
            <h4 className="font-medium">{method.name}</h4>
            <p className="text-sm">{method.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {method.primary && <Badge>Primary</Badge>}
          <Button variant="ghost" size="sm">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
