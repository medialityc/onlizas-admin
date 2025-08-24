import dynamic from "next/dynamic";
import { Metadata } from "next";
import InventoryContainer from "@/sections/provider-management/inventory/inventory-container";

export const metadata: Metadata = {
  title: "Inventory | ZAS Express",
  description: "Product inventory and stock management",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

export default function Page() {
  return <InventoryContainer />;
}
