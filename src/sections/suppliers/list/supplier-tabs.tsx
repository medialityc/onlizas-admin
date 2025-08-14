import React from "react";
import { suppliersTabs } from "../config/tabs";
import { NavigationTabs } from "@/components/tab/navigation-tabs";
import { countSuppliers } from "@/services/supplier";

async function SupplierTabs() {
  const { data } = await countSuppliers();
  const tabs = suppliersTabs.map((tab) => {
    if (tab.id === "all") {
      return { ...tab, count: data?.total };
    }
    if (tab.id === "pending") {
      return { ...tab, count: data?.pending };
    }
    if (tab.id === "valid") {
      return { ...tab, count: data?.approved };
    }
    return tab;
  });
  return <NavigationTabs tabs={tabs} className="mb-6" />;
}

export default SupplierTabs;
