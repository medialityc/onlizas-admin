"use client";

import { DataCard } from "../../modals/components/info-card";
import { Store } from "@/types/stores";

export type CardsGridProps = {
  items: Store[];
};

export function CardsGrid({ items }: CardsGridProps) {
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
