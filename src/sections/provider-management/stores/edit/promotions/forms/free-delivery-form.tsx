import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";

import { FormInput, ProductMultiSelect, FormDate, FormDateRanges, ValueSelector } from "../components/form-fields";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import PromotionTypeHeader from "../components/form-fields/promotion-type-header";
import PromotionBasicInfo from "../components/form-fields/promotion-basic-info";
import PurchaseRequirements from "../components/form-fields/purchase-requirements";
import { usePromotionFreeMutations } from "../hooks/mutations/usePromotionFreeMutations";
import { togglePromotionStatus } from "@/services/promotions";
import { navigateAfterSave } from "../utils/promotion-helpers";
import { buildPromotionFormData } from "../form/promotion-form-builder";
// Esquema específico para free delivery
import { freeDeliverySchema, type FreeDeliveryFormData } from "../schemas/free-delivery-schema";
import type { Promotion } from "@/types/promotions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import { getCommonDefaultValues } from "../utils/default-values";

interface FreeDeliveryFormProps {
  storeId: number;
  mode: string;
  promotionData?: Promotion //& { simpleDates: [] }; // Cambiado a Promotion para usar el objeto del backend directamente
  onCancel: () => void;
  isLoading?: boolean;

}

// Form values specific for Free Delivery form. Keep fields optional because different promotion types may omit some.
// Use schema inferred type for form values
// FreeDeliveryFormData is imported from schema

/**
 * Formulario específico para promociones de entrega gratuita
 * Basado en el diseño de la imagen proporcionada
 */
export default function FreeDeliveryForm({
  storeId,
  //onSubmit, 
  promotionData,
  mode,
  onCancel,
  isLoading = false,

}: FreeDeliveryFormProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const methods = useForm<FreeDeliveryFormData>({
    resolver: zodResolver(freeDeliverySchema),
    defaultValues: {
      ...getCommonDefaultValues(promotionData),
      // Campos específicos de free-delivery
      discountType: 3,
      discountValue: 0,
      dateRanges: mode === "create" ? [{ startDate: today, endDate: tomorrow }] : getCommonDefaultValues(promotionData).dateRanges || [],

    },
  });
  const mutations = usePromotionFreeMutations(storeId);
  const loading = mutations.isCreating || mutations.isUpdating || isLoading;
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = methods;
  console.log(methods.formState.errors)

  const onFormSubmit = handleSubmit(async (data) => {
    // Usar la función reutilizable para construir FormData
    const formData = buildPromotionFormData(data, storeId, "free-delivery", promotionData);
    await onSubmit(formData, data);
  });
  const onSubmit = async (formData: FormData, data: FreeDeliveryFormData) => {
    try {
      // Si es edit y el estado cambió, actualizar el estado primero
      if (mode === "edit" && promotionData && data.isActive !== promotionData.isActive) {
        const statusRes = await togglePromotionStatus(promotionData.id);
        if (statusRes.error) {
          toast.error("Error al actualizar el estado");
          return;
        }
        toast.success("Estado actualizado exitosamente");

      }

      if (mode === "create") {
        await mutations.create(formData);
        navigateAfterSave(router);
      } else {
        await mutations.update({ promotionId: promotionData?.id!, data: formData });
        navigateAfterSave(router);
      }
    } catch (error) {
      console.error("Error al guardar promoción:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit} className="space-y-6">
        <PromotionTypeHeader title="Entrega gratuita" description="Establecer condiciones para envío y entrega gratuitos" icon={<span>🚚</span>} />
        <Card>
          <CardContent>
            <PromotionBasicInfo typeLabel="Entrega gratuita" />

            <div className="mt-4">
              <RHFImageUpload name="mediaFile" variant="rounded" label="Imagen de Promoción" size="full" />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader className="pb-0">
            <CardTitle>Valor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-3">
              <div className="pt-0">
                {/* Mostrar el selector de tipo de valor. En este formulario es siempre 'Gratis' */}
                <ValueSelector
                  showFreeDelivery={true}
                  showAmount={false}
                  showFree={false}
                  showPercent={false}
                  defaultType={3}
                  freeDeliveryLabel="Entrega Gratuita"
                  typeName="discountType"
                  valueName="discountValue" />
              </div>
              <div>
                <ProductMultiSelect multiple={true} name="productVariantsIds" storeId={storeId} label="Productos aplicables" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requisitos de compra mínima</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseRequirements />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> <Label >Usos máximos de descuento *</Label></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput name="usageLimit" label="Límite de veces que se puede usar en total" type="spinner" />
              <FormInput name="usageLimitPerUser" label="Límite de veces que se puede usar por cliente" type="number" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vigencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Rangos de fechas */}
              <div>
                <FormDateRanges />
              </div>

              {/* Días específicos */}
              <div>
                <FormDate />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-6">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
          <LoaderButton color="primary" type="submit" loading={loading} disabled={loading} className="min-w-[140px]">{loading ? "Guardando..." : mode === "create" ? "Crear promoción" : "Guardar cambios"}</LoaderButton>
        </div>
      </form>
    </FormProvider>
  );
}