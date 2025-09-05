import { Suspense } from "react";
import PromotionFormSkeleton from "@/sections/provider-management/stores/edit/promotions/components/skeletons/promotion-form-skeleton";

export default function PromotionFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<PromotionFormSkeleton />}>
        {children}
      </Suspense>
    </div>
  );
}
