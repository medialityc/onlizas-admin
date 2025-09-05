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

  // Obtener datos de la promoción para determinar el tipo
  const promotionResponse = await getStorePromotionById(promotionIdNum);
  console.log(promotionResponse)
  if (promotionResponse.error || !promotionResponse.data) {
    notFound();
  }

  // GetStorePromotions es PaginatedResponse<Promotion>, pero necesitamos el primer Promotion
  //const promotions = promotionResponse.data;
  const promotion = promotionResponse.data; 
  //console.log(promotions.data)// Primer elemento del array de promociones
  
  if (!promotion) {
    notFound();
  }
  
  // Determinar el tipo basado en discountType
  let promotionType = "free-delivery"; // default
  if (promotion.discountType === 0) {
    promotionType = "order-value"; // Asumiendo que 0 es porcentaje para order-value
  } else if (promotion.discountType === 1) {
    promotionType = "order-value"; // Asumiendo que 1 es cantidad fija para order-value
  } else if (promotion.discountType === 2) {
    promotionType = "free-delivery"; // Mantener como free-delivery según el JSON
  } else if (promotion.discountType === 3) {
    promotionType = "code";
  }
  // Agregar más tipos según tu lógica

  return (
    <PromotionFormContainer 
      storeId={storeId}
      mode="edit"
      promotionData={promotion}
      promotionType={promotionType}
    />
  );
}
