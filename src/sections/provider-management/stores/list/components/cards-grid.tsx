"use client";

import { DataCard } from "../../modals/components/info-card";
import { StoreMetric } from "@/types/stores";

export type CardsGridProps = {
  items: StoreMetric[];
};

export function CardsGrid({ items }: CardsGridProps) {
  console.log(items);

  return (
    <div
      className="grid 
        gap-4 
        grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
    >
      {items.map((store) => (
        <DataCard key={store.id} store={store} />
      ))}
    </div>
  );
}

export default CardsGrid;
