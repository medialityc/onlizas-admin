"use client";

import React from "react";
import TabsWithErrorIndicators from "@/components/tab/tabs-with-error-indicators";
import { ThemeAndColorsTab, HomeBannersTab, PreviewTab } from "./index";

export default function AppearanceTabs() {
  return (
    <TabsWithErrorIndicators
      activeColorClass="text-primary"
      tabs={[
        { label: "Tema y Colores", content: <ThemeAndColorsTab /> },
        { label: "HomeBanners", content: <HomeBannersTab /> },
      ]}
    />
  );
}
