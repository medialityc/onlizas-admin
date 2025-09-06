import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";

import { FormDate, FormDateRanges, ValueSelector, ApplyToSelector } from "../components/form-fields";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import PromotionTypeHeader from "../components/form-fields/promotion-type-header";
import PromotionBasicInfo from "../components/form-fields/promotion-basic-info";
import PurchaseRequirements from "../components/form-fields/purchase-requirements";
import { togglePromotionStatus } from "@/services/promotions";
import { buildPromotionFormData } from "../form/promotion-form-builder";
// Esquema específico para code
import { codeSchema, type CodeFormData } from "../schemas/code-schema";
import type { Promotion } from "@/types/promotions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { navigateAfterSave } from "../utils/promotion-helpers";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import { usePromotionCodeMutations } from "../hooks/mutations/usePromotionCodeMutations";
import { FormProvider, RHFInputWithLabel } from "@/components/react-hook-form";
import { getCommonDefaultValues } from "../utils/default-values";

interface CodeFormProps {
  storeId: number;
  mode: string;
  promotionData?: Promotion 
  onCancel: () => void;
  isLoading?: boolean;

}

// Form values specific for Free Delivery form. Keep fields optional because different promotion types may omit some.
// Use schema inferred type for form values
// FreeDeliveryFormData is imported from schema

/**
 * Formulario específico para promociones de código de descuento
 * Basado en el diseño de la imagen proporcionada
 */
export default function PromotionCode({
  storeId,
  //onSubmit, 
  promotionData,
  mode,
  onCancel,
  isLoading = false,

}: CodeFormProps) {
  const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);


  const methods = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema) as any,
    defaultValues: {
      ...getCommonDefaultValues(promotionData),
      dateRanges: mode === "create" ? [{ startDate: today, endDate: tomorrow }] : getCommonDefaultValues(promotionData).dateRanges || [],
      
    },
  });
  const mutations = usePromotionCodeMutations(storeId);
  const loading = mutations.isCreating || mutations.isUpdating || isLoading;
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = methods;
  console.log(methods.formState.errors)

  const onFormSubmit = handleSubmit(async (data) => {
    // Usar la función reutilizable para construir FormData
    const formData = buildPromotionFormData(data, storeId, "code", promotionData);
    await onSubmit(formData, data);
  });
  const onSubmit = async (formData: FormData, data: CodeFormData) => {
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
        if (mutations.createAsync) await mutations.createAsync(formData);
        else await mutations.create(formData);
        navigateAfterSave(router);
      } else {
        if (mutations.updateAsync) await mutations.updateAsync({ promotionId: promotionData?.id!, data: formData });
        else await mutations.update({ promotionId: promotionData?.id!, data: formData });
        navigateAfterSave(router);
      }
    } catch (error) {
      console.error("Error al guardar promoción:", error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={onFormSubmit}>
      <div className="space-y-6">
        <PromotionTypeHeader title="Código de descuento" description="Establecer condiciones para descuento mediante un cóodigo" icon={<span>🏷️</span>} />
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent>
            <PromotionBasicInfo showCode={true} typeLabel="Código de descuento" />

            <div className="mt-4">
              <RHFImageUpload name="mediaFile" variant="rounded" label="Imagen de Promoción" size="full" />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-0">
            <CardTitle className="text-gray-900 dark:text-gray-100">Valor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-3">
              <div className="pt-0">
                {/* Mostrar el selector de tipo de valor para código: porcentaje o cantidad fija */}
                <ValueSelector showPercent={true} showAmount={true} showFree={false} typeName="discountType" valueName="discountValue" />
              </div>
              <div>
                <ApplyToSelector name="appliesTo" storeId={storeId} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Requisitos de compra mínima</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseRequirements />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100"> <Label >Usos máximos de descuento</Label></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RHFInputWithLabel  name="usageLimit" label="Límite de veces que se puede usar en total" type="number" />
              <RHFInputWithLabel  name="usageLimitPerUser" label="Límite de veces que se puede usar por cliente" type="number" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Vigencia</CardTitle>
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
      </div>
    </FormProvider>
  );
}