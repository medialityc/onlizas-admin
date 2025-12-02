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
  InventoryMultiSelect,
} from "../components/form-fields";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import PromotionTypeHeader from "../components/form-fields/promotion-type-header";
import PromotionBasicInfo from "../components/form-fields/promotion-basic-info";
import type { Promotion } from "@/types/promotions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import { buildPromotionFormData } from "../form/promotion-form-builder";
import { getCommonDefaultValues } from "../utils/default-values";
import { navigateAfterSave } from "../utils/promotion-helpers";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPromotionInventory,
  updatePromotionInventory,
} from "@/services/promotions";
import { getStoreById } from "@/services/stores";
import { z } from "zod";

// Schema específico para promociones por inventario
const inventoryPromotionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  active: z.boolean(),
  discountType: z.number(),
  discountValue: z.number().min(0, "El valor debe ser mayor a 0"),
  usageLimit: z.number().min(1, "Debe ser mayor a 0"),
  usageLimitPerUser: z.number().optional(),
  minimumAmount: z.number().optional(),
  minimumItems: z.number().optional(),
  requiresCode: z.boolean(),
  code: z.string().optional(),
  mediaFile: z.any().optional(),
  dateRanges: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  ),
  simpleDates: z.array(z.date()).optional(),
  inventoryIds: z
    .array(z.string())
    .min(1, "Selecciona al menos un item de inventario"),
});

type InventoryPromotionFormData = z.infer<typeof inventoryPromotionSchema>;

interface InventoryPromotionFormProps {
  storeId: string;
  mode: string;
  promotionData?: Promotion;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function InventoryPromotionForm({
  storeId,
  promotionData,
  mode,
  onCancel,
  isLoading = false,
}: InventoryPromotionFormProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Asegurar que las fechas estén en el futuro
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const methods = useForm<InventoryPromotionFormData>({
    resolver: zodResolver(inventoryPromotionSchema),
    defaultValues: {
      ...getCommonDefaultValues(promotionData),
      // Campos específicos del formulario de inventario
      dateRanges:
        mode === "create"
          ? [{ startDate: tomorrow, endDate: dayAfterTomorrow }] // Fechas futuras válidas
          : getCommonDefaultValues(promotionData).dateRanges || [],
      inventoryIds: [],
      // Asegurar que los campos requeridos tengan valores válidos
      active: true, // Siempre activa por defecto ya que no hay control en UI
      discountType: promotionData?.discountType
        ? // Si viene del backend, mapear: 1->0 (Porcentaje->percent), 2->1 (MontoFijo->amount)
          promotionData.discountType === 1
          ? 0
          : promotionData.discountType === 2
            ? 1
            : 0
        : 0, // 0 = percentage por defecto en frontend
      discountValue: promotionData?.discountValue ?? 10, // Valor por defecto mayor a 0
      usageLimit: promotionData?.usageLimit ?? 100,
      requiresCode: Boolean(promotionData?.code),
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter();
  const { handleSubmit } = methods;

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  // Obtener información de la tienda para el supplierId
  const { data: storeData, isLoading: storeDataLoading } = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStoreById(storeId),
    enabled: !!storeId,
  });

  const supplierId = storeData?.data?.supplierId
    ? String(storeData.data.supplierId)
    : "";

  // Mutations para crear/actualizar
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await createPromotionInventory(formData);
      if (res.error) {
        throw new Error(
          res.message || res.detail || "Error al crear promoción"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["store-promotions", storeId],
        exact: false,
      });
      toast.success("Promoción creada exitosamente");
      navigateAfterSave(router);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al crear la promoción");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      promotionId,
      data,
    }: {
      promotionId: number;
      data: FormData;
    }) => {
      const res = await updatePromotionInventory(promotionId, data);
      if (res.error) {
        throw new Error(
          res.message || res.detail || "Error al actualizar promoción"
        );
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["store-promotions", storeId],
        exact: false,
      });
      toast.success("Promoción actualizada exitosamente");
      navigateAfterSave(router);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error al actualizar la promoción");
    },
  });

  const loading =
    createMutation.isPending || updateMutation.isPending || isLoading;

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      // Usar buildPromotionFormData para construir los datos
      const formData = buildPromotionFormData(
        data as any,
        storeId,
        "inventory",
        promotionData
      );

      // Agregar inventoryIds específicos para este endpoint
      formData.append("inventoryIds", JSON.stringify(data.inventoryIds));

      if (mode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (promotionData?.id) {
        await updateMutation.mutateAsync({
          promotionId: promotionData.id,
          data: formData,
        });
      }
    } catch (error) {
      console.error("Error al procesar formulario:", error);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onFormSubmit} className="space-y-6">
        <PromotionTypeHeader
          title="Promoción por Inventario"
          description="Aplicar descuentos a items específicos de inventario"
          icon={<span>🏪</span>}
        />

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent>
            <PromotionBasicInfo
              showCode={true}
              typeLabel="Promoción por Inventario"
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

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-0">
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Valor del Descuento *
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ValueSelector
              showPercent={true}
              showAmount={true}
              showFree={false}
              typeName="discountType"
              valueName="discountValue"
            />

            {/* Selector de inventario usando el componente reutilizable */}
            <InventoryMultiSelect
              multiple={true}
              name="inventoryIds"
              storeId={storeId}
              supplierId={supplierId}
              label="Items de Inventario *"
            />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Requisitos Mínimos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              name="minimumAmount"
              label="Monto mínimo de compra"
              type="number"
              step="0.01"
            />
            <FormInput
              name="minimumItems"
              label="Cantidad mínima de productos"
              type="number"
            />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              Límites de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="usageLimit"
                label="Límite de usos total *"
                type="number"
              />
              <FormInput
                name="usageLimitPerUser"
                label="Límite de usos por usuario"
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
              <div>
                <FormDateRanges />
              </div>
              <div>
                <FormDate name="simpleDates" />
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
