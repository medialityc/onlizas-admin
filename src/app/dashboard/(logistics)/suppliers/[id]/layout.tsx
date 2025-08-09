import { NavigationTabs } from "@/components/tab/navigation-tabs";
import EditHeader from "@/sections/suppliers/edit/edit-header";
import SupplierBreadcrumb from "@/sections/suppliers/edit/supplier-breadcrumb";
import { getSupplierDetails } from "@/services/supplier";
import { notFound } from "next/navigation";
import React from "react";

type SupplierLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
};

export default async function SupplierLayout({
  children,
  params,
}: SupplierLayoutProps) {
  const supplierId = (await params).id;
  const supplierTabs = [
    {
      label: "Información General",
      href: `/dashboard/suppliers/${supplierId}`,
      icon: undefined,
    },
    {
      label: "Proceso de Aprobación",
      href: `/dashboard/suppliers/${supplierId}/approval-process`,
      icon: undefined,
    },
    {
      label: "Evaluaciones",
      href: `/dashboard/suppliers/${supplierId}/evaluations`,
      icon: undefined,
    },
  ];
  const { data: supplierDetails } = await getSupplierDetails(supplierId);

  if (!supplierDetails) {
    notFound();
  }

  return (
    <div className="min-h-screen rounded-lg bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="animate-fadeIn">
          <SupplierBreadcrumb supplierDetails={supplierDetails} />
        </div>

        {/* Header */}
        <EditHeader supplierDetails={supplierDetails} />

        {/* Navigation Tabs */}
        <div className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
          <NavigationTabs tabs={supplierTabs} />
        </div>

        {/* Content Sections - Pass supplierDetails to children via React Context */}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
