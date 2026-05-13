"use client";

import { AlertBox } from "@/components/alert/alert-box";
import { useIsSupplierApproved } from "@/hooks/use-is-supplier-approved";
import { useTranslations } from "next-intl";

export function PendingApprovalBanner() {
  const t = useTranslations("supplier");
  const isApproved = useIsSupplierApproved();

  if (isApproved) return null;

  return (
    <div className="mb-4">
      <AlertBox
        variant="warning"
        title={t("pendingApproval.banner")}
        message={t("pendingApproval.description")}
      />
    </div>
  );
}
