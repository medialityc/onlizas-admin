import PromotionFormContainer from "@/sections/provider-management/stores/edit/promotions/form/promotion-form-container";
import { notFound } from "next/navigation";
import { getStorePromotionById } from "@/services/promotions";

interface EditPromotionPageProps {
  params: Promise<{ 
    id: string; 
    promotionId: string; 
  }>;
}

/**
 * Página para editar promociones
 * Recibe el ID de la promoción y renderiza el formulario con datos precargados
 */
export default async function EditPromotionPage({ params }: EditPromotionPageProps) {
  const { id, promotionId } = await params;
  const storeId = parseInt(id);
  const promotionIdNum = parseInt(promotionId);

  if (isNaN(storeId) || isNaN(promotionIdNum)) {
    notFound();
  }

  // Obtener datos de la promoción
  const promotionResponse = await getStorePromotionById(promotionIdNum);
  
  if (promotionResponse.error || !promotionResponse.data) {
    notFound();
  }

  const promotion = promotionResponse.data; 
  
  if (!promotion) {
    notFound();
  }

  return (
    <PromotionFormContainer 
      storeId={storeId}
      mode="edit"
      promotionData={promotion}
    />
  );
}
