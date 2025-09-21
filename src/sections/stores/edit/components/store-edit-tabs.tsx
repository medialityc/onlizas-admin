"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Cog6ToothIcon,
  BookOpenIcon,
  Squares2X2Icon,
  TagIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import AppearanceContainer from "../appearance/appearance-container";
import CategoriesContainer from "../categories/categories-container";
import GeneralContainer from "../general/general-container";
import PromotionsContainer from "../promotions/promotions-container";
import LoaderButton from "@/components/loaders/loader-button";
import { Store } from "@/types/stores";
import styles from "./store-edit-tabs.module.css";
import TabsWithErrorIndicators from "@/components/tab/tabs-with-error-indicators";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

interface TabsProps {
  store: Store;
}

const StoreTabs = ({ store }: TabsProps) => {
  const { formState } = useFormContext();

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasUpdatePermission = hasPermission(["UPDATE_ALL"]);

  return (
    <div className={`store-edit-tabs ${styles.tabsUnderline}`}>
      {/* Botón Guardar Cambios con loader, apuntando al form "store-edit-form" */}
      {hasUpdatePermission && (
        <div className="flex justify-end py-0">
          <LoaderButton
            form="store-edit-form"
            type="submit"
            loading={formState.isSubmitting}
            className="border-t-secondary-dark-light btn-md "
          >
            <span className="inline-flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </span>
          </LoaderButton>
        </div>
      )}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <TabsWithErrorIndicators
          activeColorClass="text-primary"
          tabs={[
            {
              label: "Información General",
              icon: <Cog6ToothIcon className="w-6 h-6" />,
              content: <GeneralContainer />,
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
