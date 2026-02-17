import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";

import {
  FormInput,
  FormDate,
  FormDateRanges,
  ValueSelector,
} from "../components/form-fields";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import PromotionTypeHeader from "../components/form-fields/promotion-type-header";
import PromotionBasicInfo from "../components/form-fields/promotion-basic-info";
// import PurchaseRequirements from "../components/form-fields/purchase-requirements"; // not used here per request
// Esquema específico para order value
import { type OrderValueFormData } from "../schemas/order-value-schema";
import type { Promotion } from "@/types/promotions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import { buildPromotionFormData } from "../form/promotion-form-builder";
import { getCommonDefaultValues } from "../utils/default-values";
import { togglePromotionStatus } from "@/services/promotions";
import { GetyFormData, getySchema } from "../schemas/gety-schema";
import { navigateAfterSave } from "../utils/promotion-helpers";
import { usePromotionXGetYMutations } from "../hooks/mutations/usePromotionXGetYMutations";
import ProductSelect from "../components/form-fields/product-multi-select";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { getStoreById } from "@/services/stores";

interface GetYFormProps {
  storeId: string; // Cambiado a string para GUIDs
  mode: string;
  promotionData?: Promotion;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Formulario específico para promociones de descuento por valor del pedido
 * Basado en el diseño de la imagen proporcionada y siguiendo el patrón de free-delivery
 */
export default function GetYForm({
  storeId,
  promotionData,
  mode,
  onCancel,
  isLoading = false,
}: GetYFormProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const methods = useForm<GetyFormData>({
    resolver: zodResolver(getySchema),
    defaultValues: {
      ...getCommonDefaultValues(promotionData),
      dateRanges:
        mode === "create"
          ? [{ startDate: today, endDate: tomorrow }]
          : getCommonDefaultValues(promotionData).dateRanges || [],
    },
  });
  const mutations = usePromotionXGetYMutations(storeId);
  const loading = mutations.isCreating || mutations.isUpdating || isLoading;
  const router = useRouter();
  const { handleSubmit } = methods;

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);

  // Obtener información de la tienda para el supplierId
  const { data: storeData } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
    enabled: !!storeId,
  });

  const supplierId = storeData?.data?.supplierId ? String(storeData.data.supplierId) : "";

  const onFormSubmit = handleSubmit(async (data) => {
    // Usar la función reutilizable para construir FormData
    const formData = buildPromotionFormData(
      data as any,
      storeId,
      "order-value",
      promotionData
    );
    await onSubmit(formData, data as any);
  });
  const onSubmit = async (formData: FormData, data: OrderValueFormData) => {
    try {
      // Si es edit y el estado cambió, actualizar el estado primero
      if (
        mode === "edit" &&
        promotionData &&
        data.active !== promotionData.active
      ) {
        const statusRes = await togglePromotionStatus(promotionData.id);
        if (statusRes.error) {
          toast.error("Error al actualizar el estado");
          return;
        }
        toast.success("Estado actualizado exitosamente");
      }

      if (mode === "create") {
        if (mutations.createAsync) {
          await mutations.createAsync(formData);
        } else {
          await mutations.create(formData);
        }
        navigateAfterSave(router);
      } else {
        if (promotionData && promotionData.id) {
          const updatePayload = {
            promotionId: promotionData.id,
            data: formData,
          };
          if (mutations.updateAsync) {
            await mutations.updateAsync(updatePayload);
          } else {
            await mutations.update(updatePayload);
          }
          navigateAfterSave(router);
        } else {
          toast.error("No se encontró el ID de la promoción para actualizar.");
        }
      }
    } catch (error) {
      console.error("Error al guardar promoción:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit} className="space-y-6">
        <PromotionTypeHeader
          title="Descuento por producto"
          description="Establecer valores para descuento para un producto Y comprando un prodcuto X"
          icon={<span> 🎁 </span>}
        />
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent>
            <PromotionBasicInfo
              showCode={false}
              typeLabel="Descuento por producto"
            />
            <div className="mt-4">
              <RHFImageUpload
                name="mediaFile"
                variant="rounded"
                label="Imagen de Promoción"
                size="full"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-0">
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Valor *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-3">
              <div className="pt-0">
                {/* Mostrar el selector de tipo de valor: percentage / fixed */}
                <ValueSelector
                  showPercent={true}
                  showAmount={true}
                  showFree={true}
                  typeName="discountType"
                  valueName="discountValue"
                />
              </div>
              <ProductSelect
                name="productIdX"
                storeId={storeId}
                supplierId={supplierId}
                label="Producto X"
                multiple={false}
              />
              <ProductSelect
                name="productIdY"
                storeId={storeId}
                supplierId={supplierId}
                label="Producto Y"
                multiple={false}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Requisitos de compra mínima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aquí pediste un único spinner para la cantidad mínima */}
              <RHFInputWithLabel
                name="minimumAmount"
                label="Cantidad mínima de producto X (C$)"
                type="number"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              {" "}
              <Label>Usos máximos de descuento *</Label>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="usageLimit"
                label="Límite de veces que se puede usar en total"
                type="number"
              />
              <FormInput
                name="usageLimitPerUser"
                label="Límite de veces que se puede usar por cliente"
                type="number"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Vigencia
            </CardTitle>
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
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          {hasUpdatePermission && (
            <LoaderButton
              color="primary"
              type="submit"
              loading={loading}
              disabled={loading}
              className="min-w-[140px]"
            >
              {loading
                ? "Guardando..."
                : mode === "create"
                  ? "Crear promoción"
                  : "Guardar cambios"}
            </LoaderButton>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
