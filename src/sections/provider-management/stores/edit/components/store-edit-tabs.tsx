"use client";

import React from "react";
import {
  Cog6ToothIcon,
  BookOpenIcon,
  Squares2X2Icon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import AppearanceContainer from "../appearance/appearance-container";
import CategoriesContainer from "../categories/categories-container";
import GeneralContainer from "../general/general-container";
import PromotionsContainer from "../promotions/promotions-container";
import TabsWithErrorIndicators from "../../../../../components/tab/tabs-with-error-indicators";
import { Store } from "@/types/stores";
import styles from "./store-edit-tabs.module.css";
import FollowersContainer from "../followers/followers-container";


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
            {
              label: "Followers",
              icon: <UsersIcon className="w-6 h-6" />,
              content: <FollowersContainer store={store} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default StoreTabs;
