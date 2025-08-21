"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { useSearchParams } from "next/navigation";
import SupplierEvaluationsContent from "./supplier-evaluations-content";
import { GetSupplierEvaluations } from "@/types/suppliers";

export default function SupplierEvaluations({
  evaluationsData,
}: {
  evaluationsData: GetSupplierEvaluations;
}) {
  const searchParams = useSearchParams();
  const { updateFiltersInUrl } = useFiltersUrl();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageChange = (page: number) => {
    updateFiltersInUrl({ page });
  };

  return (
    <SupplierEvaluationsContent
      evaluationsData={evaluationsData}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
}
