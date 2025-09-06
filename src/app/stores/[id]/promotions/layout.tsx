import { Suspense } from "react";
import PromotionFormSkeleton from "@/sections/provider-management/stores/edit/promotions/components/skeletons/promotion-form-skeleton";
import ProviderLayout from "@/layouts/dashboard-layout-provider";
import DefaultLayout from "@/layouts/dashboard-layout";


export default function PromotionFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  let provider = false
  if (typeof window !== "undefined") {

    const saved = localStorage.getItem("promotionFormBackPath");
    if (saved) {
      if (saved.includes("/provider"))
        provider = true
    }
  }
  const Layout = provider ? ProviderLayout : DefaultLayout;

  return (
    <Layout>
      {/* wrapper class store-promotions-view permite apuntar facilmente a hijos (modals, tabs, cards) */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 store-promotions-view">
        <Suspense fallback={<PromotionFormSkeleton />}>
          {children}
        </Suspense>
      </div>
    </Layout>

  );
}
