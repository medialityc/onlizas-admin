"use client";
import React from "react";
import { suppliersTabs } from "../config/tabs";
import { NavigationTabs } from "@/components/tab/navigation-tabs";

function SupplierTabs() {
  return <NavigationTabs tabs={suppliersTabs} className="mb-6" />;
}

export default SupplierTabs;
