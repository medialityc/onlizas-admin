import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";

import { FormInput, FormTextarea, FormToggle, ProductMultiSelect, FormDate, FormDateRanges, ValueSelector } from "../components/form-fields";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import PromotionTypeHeader from "../components/form-fields/promotion-type-header";
import PromotionBasicInfo from "../components/form-fields/promotion-basic-info";
// import PurchaseRequirements from "../components/form-fields/purchase-requirements"; // not used here per request
import { usePromotionOvervalueMutations } from "../hooks/mutations/usePromotionOvervalueMutations";
// Esquema específico para order value
import { orderValueSchema, type OrderValueFormData } from "../schemas/order-value-schema";
import type { PromotionRequest, Promotion } from "@/types/promotions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import { buildPromotionFormData } from "../form/promotion-form-builder";
import { getCommonDefaultValues } from "../utils/default-values";
import { togglePromotionStatus } from "@/services/promotions";
import { RHFInputWithLabel } from "@/components/react-hook-form";

interface OrderValueFormProps {
    storeId: number;
    mode: string;
    promotionData?: Promotion;
    onCancel: () => void;
    isLoading?: boolean;
}

/**
 * Formulario específico para promociones de descuento por valor del pedido
 * Basado en el diseño de la imagen proporcionada y siguiendo el patrón de free-delivery
 */
export default function OrderValueForm({
    storeId,
    promotionData,
    mode,
    onCancel,
    isLoading = false,

}: OrderValueFormProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const methods = useForm<OrderValueFormData>({
        resolver: zodResolver(orderValueSchema),
        defaultValues: {
            ...getCommonDefaultValues(promotionData),
            dateRanges: mode === "create" ? [{ startDate: today, endDate: tomorrow }] : getCommonDefaultValues(promotionData).dateRanges || [],

            // Campos específicos de order-value
            discountType: promotionData?.discountType ?? 1,
            discountValue: promotionData?.discountValue ?? 0,
        },
    });
    const mutations = usePromotionOvervalueMutations(storeId);
    const loading = mutations.isCreating || mutations.isUpdating || isLoading;
    const router = useRouter();
    const { handleSubmit, register, formState: { errors } } = methods;

    const onFormSubmit = handleSubmit(async (data) => {
        // Usar la función reutilizable para construir FormData
        const formData = buildPromotionFormData(data as any, storeId, "order-value", promotionData);
        await onSubmit(formData, data as any);
    });
    const onSubmit = async (formData: FormData, data: OrderValueFormData) => {
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
                router.push(`/provider/stores/${storeId}?tab=promotions`);
            } else {
                if (mutations.updateAsync) await mutations.updateAsync({ promotionId: promotionData?.id!, data: formData });
                else await mutations.update({ promotionId: promotionData?.id!, data: formData });
                router.push(`/provider/stores/${storeId}?tab=promotions`);
            }
        } catch (error) {
            console.error("Error al guardar promoción:", error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={onFormSubmit} className="space-y-6">
                <PromotionTypeHeader title="Descuento por valor del pedido" description="Establecer condiciones de descuento basado en el valor del pedido" icon={<span>🛒</span>} />
                <Card>
                    <CardContent>
                        <PromotionBasicInfo showCode={false} typeLabel="Descuento por pedido" />
                        <div className="mt-4">
                            <RHFImageUpload name="mediaFile" variant="rounded" label="Imagen de Promoción" size="full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="gap-2">
                    <CardHeader className="pb-0">
                        <CardTitle>Valor *</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="pt-0">
                                {/* Mostrar el selector de tipo de valor: percentage / fixed */}
                                <ValueSelector showPercent={true} showAmount={true} showFree={false} typeName="discountType" valueName="discountValue" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Requisitos de compra mínima</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Aquí pediste un único spinner para la cantidad mínima */}
                            <RHFInputWithLabel name="minimumAmount" label="Cantidad mínima (C$)" type="number" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle> <Label >Usos máximos de descuento *</Label></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput name="usageLimit" label="Límite de veces que se puede usar en total" type="number" />
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
