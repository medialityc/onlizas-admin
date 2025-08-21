"use client";

import React from "react";
import IconSettings from "@/components/icon/icon-settings";
import IconBook from "@/components/icon/icon-book";
import IconLayout from "@/components/icon/icon-layout";
import IconTag from "@/components/icon/icon-tag";
import { TabItem } from "@/components/tab/navigation-tabs";
import { store } from "@/store";
import AppearanceContainer from "../appearance/appearance-container";
import CategoriesContainer from "../categories/categories-container";
import GeneralContainer from "../general/general-container";
import PromotionsContainer from "../promotions/promotions-container";
import TabsWithErrorIndicators from "../../../../../components/tab/tabs-with-error-indicators";
import { Store } from "@/types/stores";

interface TabsProps {
  store: Store;
}

const StoreTabs = ({ store }: TabsProps) => {
  return (
    <div>
      <TabsWithErrorIndicators
        tabs={[
          {
            label: "Información General",
            icon: <IconSettings className="w-4 h-4" />,
            content: <GeneralContainer store={store} />,
          },
          {
            label: "Categorias",
            icon: <IconBook className="w-4 h-4" />,
            content: <CategoriesContainer store={store} />,
          },
          {
            label: "Apariencia",
            icon: <IconLayout className="w-4 h-4" />,
            content: <AppearanceContainer store={store} />,
          },
          {
            label: "Promociones",
            icon: <IconTag className="w-4 h-4" />,
            content: <PromotionsContainer store={store} />,
          },
        ]}
      />
    </div>
  );
};

export default StoreTabs;

export const DefaultIcons = {
  general: <IconSettings className="w-4 h-4" />,
  categories: <IconBook className="w-4 h-4" />,
  appearance: <IconLayout className="w-4 h-4" />,
  promotions: <IconTag className="w-4 h-4" />,
};
