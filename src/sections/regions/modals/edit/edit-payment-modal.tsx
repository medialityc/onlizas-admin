"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleModal from "@/components/modal/modal";
import { Button } from "@/components/button/button";
import { Badge } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addPaymentGatewaysToRegion } from "@/services/regions";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";

// Importar schemas y tipos desde el archivo centralizado
import { 
    paymentGatewaySchema, 
    PaymentGatewayFormData, 
    PaymentGateway,
    AVAILABLE_PAYMENT_METHODS 
} from "@/sections/regions/schemas/region-modal-schemas";

interface EditPaymentModalProps {
    open: boolean;
    onClose: () => void;
    paymentGateway: PaymentGateway | null;
    regionId: number;
}

export default function EditPaymentModal({
    open,
    onClose,
    paymentGateway,
    regionId
}: EditPaymentModalProps) {
    const queryClient = useQueryClient();
    const { data: permissions = [] } = usePermissions();
    
    const hasPermission = (requiredPerms: string[]) => {
        return requiredPerms.some(perm => permissions.some((p: any) => p.code === perm));
    };
    
    const canEdit = hasPermission(["UPDATE_ALL"]);

    const methods = useForm<PaymentGatewayFormData>({
        resolver: zodResolver(paymentGatewaySchema)
    });

    const { handleSubmit, reset, watch, setValue, formState: { isSubmitting, errors } } = methods;
    const watchedValues = watch();

    // Reset form cuando cambia el paymentGateway
    useEffect(() => {
        if (paymentGateway && open) {
            reset({
                paymentGatewayId: paymentGateway.paymentGatewayId,
                priority: paymentGateway.priority,
                isFallback: paymentGateway.isFallback,
                isEnabled: paymentGateway.isEnabled,
                supportedMethods: paymentGateway.supportedMethods || [],
                configurationJson: paymentGateway.configurationJson || ""
            });
        }
    }, [paymentGateway, open, reset]);

    // Submit simplificado - envía directamente la data del form
    const onSubmit = async (data: PaymentGatewayFormData) => {
        if (!canEdit) return;

        try {
            const response = await addPaymentGatewaysToRegion(regionId, {
                paymentGateways: [data] // Envía directamente la data sin transformar
            });

            if (!response.error) {
                toast.success("Configuración de pasarela de pago actualizada");
                queryClient.invalidateQueries({ queryKey: ["regions"] });
                onClose();
            } else {
                toast.error(response.message || "Error al actualizar configuración");
            }
        } catch (error) {
            toast.error("Error al actualizar configuración");
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    const handleMethodToggle = (method: string) => {
        if (!canEdit) return;

        const currentMethods = watchedValues.supportedMethods || [];
        const isSelected = currentMethods.includes(method);

        if (isSelected) {
            setValue("supportedMethods", currentMethods.filter(m => m !== method));
        } else {
            setValue("supportedMethods", [...currentMethods, method]);
        }
    };

    if (!paymentGateway) return null;

    return (
        <SimpleModal
            title={`Editar ${paymentGateway.name}`}
            open={open}
            onClose={handleClose}
            loading={isSubmitting}
        >
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Información de la Pasarela de Pago
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                                <span className="font-medium">{paymentGateway.name} ({paymentGateway.code})</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                                <div className="flex space-x-2">
                                    {paymentGateway.isFallback && (
                                        <Badge color="blue" variant="light" size="sm">
                                            Respaldo
                                        </Badge>
                                    )}
                                    <Badge
                                        color={paymentGateway.isEnabled ? "green" : "gray"}
                                        variant="light"
                                        size="sm"
                                    >
                                        {paymentGateway.isEnabled ? "Habilitada" : "Deshabilitada"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Configuración editable */}
                    <div className="space-y-4">
                        {/* Estado de habilitación */}
                        <RHFSwitch
                            name="isEnabled"
                            label="Estado de Habilitación"
                            helperText="Habilitar esta pasarela de pago en la región"
                            disabled={!canEdit || isSubmitting}
                        />

                        {/* Prioridad */}
                        <RHFInputWithLabel
                            name="priority"
                            type="number"
                            label="Prioridad"
                            placeholder="50"
                            underLabel="Orden de preferencia (1 = mayor prioridad, 100 = menor prioridad)"
                            disabled={!canEdit || isSubmitting}
                            minMax={{ min: 1, max: 100 }}
                            required
                        />

                        {/* Es pasarela de respaldo */}
                        <RHFSwitch
                            name="isFallback"
                            label="Pasarela de Respaldo"
                            helperText="Usar como opción de respaldo cuando otras fallan"
                            disabled={!canEdit || isSubmitting}
                        />

                        {/* Métodos de pago soportados */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Métodos de Pago Soportados
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {AVAILABLE_PAYMENT_METHODS.map((method) => {
                                    const isSelected = watchedValues.supportedMethods?.includes(method.value) || false;
                                    return (
                                        <div
                                            key={method.value}
                                            onClick={() => handleMethodToggle(method.value)}
                                            className={`
                                                p-3 rounded-lg border cursor-pointer transition-all
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                }
                                                ${!canEdit || isSubmitting ? 'cursor-not-allowed opacity-50' : ''}
                                            `}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className={`
                                                    w-4 h-4 rounded border-2 flex items-center justify-center
                                                    ${isSelected
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                    }
                                                `}>
                                                    {isSelected && (
                                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{method.label}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.supportedMethods && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.supportedMethods.message}
                                </p>
                            )}
                        </div>

                        {/* Configuración JSON opcional */}
                        <RHFInputWithLabel
                            name="configurationJson"
                            type="textarea"
                            label="Configuración JSON (Opcional)"
                            placeholder='{"key": "value"}'
                            underLabel="Configuración adicional en formato JSON"
                            disabled={!canEdit || isSubmitting}
                            rows={4}
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="button"
                            outline={true}
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        {canEdit && (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        )}
                    </div>
                </div>
            </FormProvider>
        </SimpleModal>
    );
}