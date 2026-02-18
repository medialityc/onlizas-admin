"use client";

import React from "react";
import TabsWithErrorIndicators from "@/components/tab/tabs-with-error-indicators";
import { BannersTab, PreviewTab } from "./banners/index";
import ThemeAndColorsTab from "./theme/components/theme-and-colors-tab";
import { Store } from "@/types/stores";

interface AppearanceTabsProps {
  store: Store;
}

export default function AppearanceTabs({ store }: AppearanceTabsProps) {
  return (
    <TabsWithErrorIndicators
      activeColorClass="text-primary"
      tabs={[
        { label: "Tema y Colores", content: <ThemeAndColorsTab /> },
        { label: "Banners", content: <BannersTab storeId={store.id} /> },
      ]}
    />
  );
}
