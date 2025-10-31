"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WarehouseTransfer } from "@/types/warehouses-transfers";
import showToast from "@/config/toast/toastConfig";
import { createTransferReceptionSchema, CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";

// Tipo para el formulario de recepción
// El container ahora utiliza el schema unificado `createTransferReceptionSchema`
// Los campos legacy (receivedItems, discrepancies) se reemplazan por `items[]`
// con propiedades tipadas: receivedQuantity, discrepancyType, discrepancyNotes.
import { useRouter } from "next/navigation";
import TransferReceptionTabs from "../components/transfer-reception/transfer-reception-tabs";


interface Props {
    transfer: WarehouseTransfer;
}

// NOTA: El backend espera CreateReceptionData; se mapeará desde CreateTransferReceptionFormData al enviar.

export default function TransferReceptionContainer({ transfer }: Props) {
    const [activeTab, setActiveTab] = useState("reception");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const methods = useForm<CreateTransferReceptionFormData>({
        resolver: zodResolver(createTransferReceptionSchema),
        defaultValues: {
            transferId: String(transfer.id),
            status: "PENDING", // estado inicial
            notes: "",
            items: transfer.items?.map(itm => ({
                transferItemId: String(itm.id),
                receivedQuantity: 0, // valor inicial editable en UI
                batchNumber: "",
                expiryDate: "",
                discrepancyType: undefined,
                discrepancyNotes: "",
                isAccepted: true,
            })) || [],
            unexpectedProducts: [],
            evidence: [],
            documentationNotes: "",
            documentationComplete: false,
        },
    });

    const { handleSubmit, watch, reset } = methods;

    const handleCompleteReception = async (data: CreateTransferReceptionFormData) => {
        setIsSubmitting(true);
        try {
            // Mapear al formato esperado por el backend (CreateReceptionData)
            const payload = {
                transferId: data.transferId,
                status: data.status as any, // ajustar al tipo backend si difiere
                notes: data.notes || "",
                items: data.items.map(itm => ({
                    transferItemId: itm.transferItemId,
                    receivedQuantity: itm.receivedQuantity,
                    batchNumber: itm.batchNumber || undefined,
                    expiryDate: itm.expiryDate || undefined,
                    discrepancyType: itm.discrepancyType || undefined,
                    discrepancyNotes: itm.discrepancyNotes || undefined,
                    isAccepted: itm.isAccepted ?? true,
                })),
                unexpectedProducts: data.unexpectedProducts?.map(up => ({
                    productName: up.productName,
                    quantity: up.quantity,
                    unit: up.unit,
                    batchNumber: up.batchNumber || undefined,
                    observations: up.observations || undefined,
                })) || [],
            };

            // TODO: llamar a receiveTransfer(payload)
            console.log("Payload recepción a enviar:", payload);
            const response = { success: true };

            if (!response.success) {
                showToast("Error al completar la recepción", "error");
            } else {
                showToast("Recepción completada exitosamente", "success");
                // Redirigir de vuelta a la lista de transferencias del almacén destino
                const pathParts = window.location.pathname.split('/');
                const warehouseType = pathParts[3]; // physical o virtual
                const warehouseId = transfer.destinationId;
                const listPath = `/dashboard/warehouses/${warehouseType}/${warehouseId}/transfers/list`;
                router.push(listPath);
            }
        } catch (error) {
            console.error("Error completing reception:", error);
            showToast("Ocurrió un error inesperado", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = () => {
        // Implementar guardado como borrador si es necesario
        showToast("Borrador guardado", "success");
    };

    return (
        <div className="space-y-6">
            {/* Formulario principal */}
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleCompleteReception as any)} className="space-y-6">
                    {/* Tabs de navegación */}
                    <TransferReceptionTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        transfer={transfer}
                        isSubmitting={isSubmitting}
                        onSaveDraft={handleSaveDraft}
                    />
                </form>
            </FormProvider>
        </div>
    );
}