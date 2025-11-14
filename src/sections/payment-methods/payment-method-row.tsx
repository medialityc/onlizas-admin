"use client";
import type React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge, Button, Switch } from "@mantine/core";
import { GripVertical, Settings } from "lucide-react";
import type { PaymentMethod } from "@/types";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

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

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-slate-900 cursor-default space-y-3 sm:space-y-0">
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
          <button
            {...listeners}
            {...attributes}
            className="cursor-grab inline-flex items-center p-1 flex-shrink-0 self-center sm:self-auto"
            aria-label={`Arrastrar ${method.name}`}
            type="button"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </button>

          <Switch
            checked={method.enabled}
            onChange={() => onToggleEnabled(method.id)}
            aria-label={`Habilitar ${method.name}`}
            className="flex-shrink-0 self-center sm:self-auto"
          />

          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-sm sm:text-base truncate">
              {method.name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-1">
              {method.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 sm:space-x-2 flex-shrink-0">
          {method.primary && (
            <Badge size="sm" className="text-xs">
              Principal
            </Badge>
          )}
          {hasUpdatePermission && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
            >
              <Settings className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
