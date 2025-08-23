"use client";

import React from "react";
import TabsWithErrorIndicators from "@/components/tab/tabs-with-error-indicators";
import { ThemeAndColorsTab, BannersTab, PreviewTab } from "./index";

export default function AppearanceTabs() {
  return (
    <TabsWithErrorIndicators
      activeColorClass="text-primary"
      tabs={[
        { label: "Tema y Colores", content: <ThemeAndColorsTab /> },
        { label: "Banners", content: <BannersTab /> },
        { label: "Vista Previa", content: <PreviewTab /> },
      ]}
    />
  );
}
