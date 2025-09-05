import { notFound } from "next/navigation";

import { PROMOTION_TYPES } from "@/sections/provider-management/stores/edit/promotions/types/promotion-types";
import PromotionFormContainer from "@/sections/provider-management/stores/edit/promotions/form/promotion-form-container";

interface CreatePromotionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

/**
 * Página para crear promociones
 * Recibe el tipo como query param y renderiza el formulario correspondiente
 */
export default async function CreatePromotionPage({ params, searchParams }: CreatePromotionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const storeId = parseInt(resolvedParams.id);
  const promotionType = resolvedSearchParams.type;

  // Validar que el tipo existe
  if (!promotionType || !PROMOTION_TYPES.find(t => t.value === promotionType)) {
    notFound();
  }



  return (
    <PromotionFormContainer 
      storeId={storeId}
      mode="create"
      promotionType={promotionType}
    />
  );
}
