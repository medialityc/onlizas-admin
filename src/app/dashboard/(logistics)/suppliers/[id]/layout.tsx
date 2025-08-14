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

        {/* Content Sections - Pass supplierDetails to children via React Context */}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
}
