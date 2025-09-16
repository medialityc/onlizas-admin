"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import TabsWithErrorIndicators from "@/components/tab/tabs-with-error-indicators";
import { Store } from "@/types/stores";
import styles from "./store-edit-tabs.module.css";
import FollowersContainer from "../followers/followers-container";

interface TabsProps {
  store: Store;
}

const StoreTabs = ({ store }: TabsProps) => {
  const searchParams = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mapear nombres de tabs a índices
  const tabMap = {
    general: 0,
    categories: 1,
    appearance: 2,
    promotions: 3,
    followers: 4,
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tabMap[tab as keyof typeof tabMap] !== undefined) {
      setSelectedIndex(tabMap[tab as keyof typeof tabMap]);
    }
  }, [searchParams]);

  return (
    <div className={`store-edit-tabs ${styles.tabsUnderline}`}>
      <div className="border-b border-gray-200 dark:border-gray-800">
        <TabsWithErrorIndicators
          activeColorClass="text-primary"
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
          tabs={[
            {
              label: "Información General",
              icon: <Cog6ToothIcon className="w-6 h-6" />,
              content: <GeneralContainer store={store} />,
            },
            {
              label: "Categorías",
              icon: <BookOpenIcon className="w-6 h-6" />,
              content: <CategoriesContainer storeId={store.id} />,
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
