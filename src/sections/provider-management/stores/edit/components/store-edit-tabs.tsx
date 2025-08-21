"use client";

import React from "react";
import {
  Cog6ToothIcon,
  BookOpenIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";

import AppearanceContainer from "../appearance/appearance-container";
import CategoriesContainer from "../categories/categories-container";
import GeneralContainer from "../general/general-container";
import PromotionsContainer from "../promotions/promotions-container";
import TabsWithErrorIndicators from "../../../../../components/tab/tabs-with-error-indicators";
import { Store } from "@/types/stores";
import styles from "./store-edit-tabs.module.css";

interface TabsProps {
  store: Store;
}

const StoreTabs = ({ store }: TabsProps) => {
  return (
    <div className={`store-edit-tabs ${styles.tabsUnderline}`}>
      <div className="border-b border-gray-200 dark:border-gray-800">
        <TabsWithErrorIndicators
          activeColorClass="text-primary"
          tabs={[
            {
              label: "Información General",
              icon: <Cog6ToothIcon className="w-6 h-6" />,
              content: <GeneralContainer store={store} />,
            },
            {
              label: "Categorías",
              icon: <BookOpenIcon className="w-6 h-6" />,
              content: <CategoriesContainer store={store} />,
            },
            {
              label: "Apariencia",
              icon: <Squares2X2Icon className="w-6 h-6" />,
              content: <AppearanceContainer store={store} />,
            },
            {
              label: "Promociones",
              icon: <TagIcon className="w-6 h-6" />,
              content: <PromotionsContainer store={store} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default StoreTabs;

export const DefaultIcons = {
  general: <Cog6ToothIcon className="w-4 h-4" />,
  categories: <BookOpenIcon className="w-4 h-4" />,
  appearance: <Squares2X2Icon className="w-4 h-4" />,
  promotions: <TagIcon className="w-4 h-4" />,
};
