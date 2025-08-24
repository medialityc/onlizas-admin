import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getStoreDetails } from "@/services/stores";
import StoreBreadcrumb from "@/sections/provider-management/stores/edit/components/store-breadcrumb";
import StoreEditHeader from "@/sections/provider-management/stores/edit/components/store-edit-header";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{
    id: number;
  }>;
};

export default async function StoreLayout({ children, params }: LayoutProps) {
  const id = (await params).id;
  const { data: store } = await getStoreDetails(id);
  if (!store) return notFound();

  return (
    <div className="p-6 space-y-4">
      {/* Breadcrumb */}
      <StoreBreadcrumb store={store} />

      {/* Beautiful header with key store info */}
      <StoreEditHeader store={store} />

      {/* Page content */}
      {children}
    </div>
  );
}
