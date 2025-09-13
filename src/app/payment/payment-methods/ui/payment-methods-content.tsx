"use client";

import { CardContent } from "@/components/cards/card";

import { useLocalStorage } from "@mantine/hooks";
import { PaymentMethod } from "../../interfaces";
import { initialMethods } from "../../data/mock-datas";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PaymentMethodRow } from "./payment-method-row";

export const PaymentMethodsContent = () => {
  const [paymentMethods, setPaymentMethods] = useLocalStorage<PaymentMethod[]>({
    key: "paymentMethods",
    defaultValue: initialMethods,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPaymentMethods((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return items;
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const toggleEnabled = (id: string) =>
    setPaymentMethods((items) =>
      items.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );

  return (
    <CardContent className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={paymentMethods.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <PaymentMethodRow
                key={method.id}
                method={method}
                onToggleEnabled={toggleEnabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </CardContent>
  );
};
