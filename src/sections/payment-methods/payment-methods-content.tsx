"use client";

import { CardContent } from "@/components/cards/card";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PaymentMethodRow } from "./payment-method-row";
import { initialMethods } from "@/services/data-for-gateway-settings/mock-datas";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useSortableList } from "@/hooks/use-sortable-list";
import { Button } from "@mantine/core";

export const PaymentMethodsContent = () => {
  const {
    items: paymentMethods,
    setItems,
    sensors,
    handleDragEnd,
  } = useSortableList(initialMethods);

  const toggleEnabled = (id: string) =>
    setItems((items) =>
      items.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );

  return (
    <CardContent className="space-y-4 sm:space-y-6  ">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext
          items={paymentMethods.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 sm:space-y-4">
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
      <div className="sticky bottom-0 pt-4">
        <Button className="w-full h-fit py-3 sm:py-4 bg-green-600 hover:bg-green-800 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 text-sm sm:text-base">
          Save Payment Method Configuration
        </Button>
      </div>
    </CardContent>
  );
};
