"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Hooks y servicios (create/update handled by type-specific hooks inside each form)

// Componentes específicos por tipo
import FreeDeliveryForm from "../forms/free-delivery-form";
import PromotionCode from "../forms/promotion-code";
import OrderValueForm from "../forms/promotion-ordervalue";

// Tipos y configuración
import { PROMOTION_TYPES } from "../types/promotion-types";
import { Promotion } from "@/types/promotions";
import AutomaticForm from "../forms/promotion-automatic";
import PackageForm from "../forms/promotion-package";
import GetYForm from "../forms/promotion-x-get-y";

interface PromotionFormContainerProps {
  storeId: number;
  mode: "create" | "edit";
  promotionType?: string;  // Solo para create
  //promotionId?: number;    // Solo para edit
  promotionData?: Promotion;
}

/**
 * Container unificado para crear/editar promociones
 * - mode="create": Muestra formulario vacío para el tipo especificado
 * - mode="edit": Carga datos y muestra formulario precargado
 */
export default function PromotionFormContainer({
  storeId,
  mode,
  promotionType,

  promotionData
}: PromotionFormContainerProps) {
  const router = useRouter();
  // create/update are handled by type-specific hooks inside each form

  // En modo creación, usar el tipo proporcionado
  const currentType = mode === "create" ? promotionType : (promotionType || undefined);

  // Buscar configuración del tipo
  const typeConfig = PROMOTION_TYPES.find(t => t.value === currentType);

  // Validaciones
  useEffect(() => {
    console.log(mode, promotionData, promotionType, "Estoy en container para form")
    if (mode === "create" && !promotionType) {
      toast.error("Tipo de promoción no especificado");
      router.back();
    }
    if (mode === "edit" && !promotionData) {
      toast.error("ID de promoción no especificado");
      router.back();
    }
  }, [mode, promotionType, promotionData, router]);

  const handleCancel = () => {
    router.push(`/provider/stores/${storeId}?tab=promotions`);
  };

  // Validar que tenemos la configuración del tipo
  if (mode === "create" && !typeConfig) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8 text-red-600">
          Tipo de promoción no válido: {promotionType}
        </div>
      </div>
    );
  }

  // Layout básico para el formulario
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 flex items-center gap-1"
        >
          ← Volver a promociones
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "create" ? "Crear promoción" : "Editar promoción"}
        </h1>
        {typeConfig && (
          <p className="text-gray-600 mt-1">{typeConfig.description}</p>
        )}
      </div>

      {/* Formulario específico por tipo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderFormByType()}
      </div>
    </div>
  );

  function renderFormByType() {
    if (!currentType) {
      return <div>Tipo de promoción no especificado</div>;
    }

    switch (currentType) {
      case "free-delivery":
        return (
          <FreeDeliveryForm
            storeId={storeId}
            promotionData={promotionData}
            //onSubmit={handleSubmit}
            mode={mode}
            onCancel={handleCancel}
            isLoading={false}
          />
        );
      case "code":
        return (
          <PromotionCode
            storeId={storeId}
            promotionData={promotionData}
            //onSubmit={handleSubmit}
            mode={mode}
            onCancel={handleCancel}
            isLoading={false}
          />
        );
      case "order-value":
        return (
          <OrderValueForm
            storeId={storeId}
            promotionData={promotionData}
            mode={mode}
            onCancel={handleCancel}
            isLoading={false}
          />
        );
         case "automatic":
        return (
          <AutomaticForm
            storeId={storeId}
            promotionData={promotionData}
            mode={mode}
            onCancel={handleCancel}
            isLoading={false}
          />
        );
        case "package":
        return (
          <PackageForm
            storeId={storeId}
            promotionData={promotionData}
            mode={mode}
            onCancel={handleCancel}
            isLoading={false}
          />
        );
        case "buy-x-get-y":
        case "buy_x_get_y":
        case "getY":
        case "get-y":
        case "gety":
          return (
            <GetYForm
              storeId={storeId}
              promotionData={promotionData}
              mode={mode}
              onCancel={handleCancel}
              isLoading={false}
            />
          );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Formulario para tipo "{currentType}" no implementado aún
          </div>
        );
    }
  }
}
