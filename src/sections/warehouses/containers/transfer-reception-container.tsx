"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WarehouseTransfer } from "@/types/warehouses-transfers";

import { CreateReceptionData } from "@/types/warehouse-transfer-receptions";
import showToast from "@/config/toast/toastConfig";

// Tipo para el formulario de recepción
interface ReceptionFormData {
    transferId: number;
    notes?: string;
    receivedItems: Record<string, number>; // transferItemId -> quantityReceived
    discrepancies: Record<string, { type: string; notes: string }>; // transferItemId -> discrepancy
    unexpectedProducts: Array<{
        productName: string;
        quantityReceived: number;
        unit: string;
        batchNumber?: string;
        observations?: string;
    }>;
    evidence: Array<{
        id?: string;
        name: string;
        type: string;
        size: number;
        url?: string;
        uploadProgress?: number;
        isUploading?: boolean;
    }>;
    documentationNotes?: string;
    documentationComplete?: boolean;
}
import { useRouter } from "next/navigation";
import TransferReceptionTabs from "../components/transfer-reception/transfer-reception-tabs";


interface Props {
    transfer: WarehouseTransfer;
}

const receptionSchema = z.object({
    transferId: z.number(),
    notes: z.string().optional(),
    receivedItems: z.record(z.number()),
    discrepancies: z.record(z.object({
        type: z.string(),
        notes: z.string(),
    })),
    unexpectedProducts: z.array(z.object({
        productName: z.string().min(1, "Nombre del producto requerido"),
        quantityReceived: z.number().min(0, "Cantidad debe ser mayor a 0"),
        unit: z.string().min(1, "Unidad requerida"),
        batchNumber: z.string().optional(),
        observations: z.string().optional(),
    })),
    evidence: z.array(z.object({
        id: z.string().optional(),
        name: z.string(),
        type: z.string(),
        size: z.number(),
        url: z.string().optional(),
        uploadProgress: z.number().optional(),
        isUploading: z.boolean().optional(),
    })),
    documentationNotes: z.string().optional(),
    documentationComplete: z.boolean().optional(),
});

export default function TransferReceptionContainer({ transfer }: Props) {
    const [activeTab, setActiveTab] = useState("reception");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const methods = useForm<ReceptionFormData>({
        resolver: zodResolver(receptionSchema),
        defaultValues: {
            transferId: transfer.id,
            notes: "",
            receivedItems: {},
            discrepancies: {},
            unexpectedProducts: [],
            evidence: [],
            documentationNotes: "",
            documentationComplete: false,
        },
    });

    const { handleSubmit, watch, reset } = methods;

    const handleCompleteReception = async (data: ReceptionFormData) => {
        setIsSubmitting(true);
        try {
            // Convertir datos del formulario a FormData para la server action
            const formData = new FormData();
            formData.append("transferId", data.transferId.toString());
            formData.append("notes", data.notes || "");
            formData.append("receivedItems", JSON.stringify(data.receivedItems));
            formData.append("discrepancies", JSON.stringify(data.discrepancies));
            formData.append("unexpectedProducts", JSON.stringify(data.unexpectedProducts));

            // TODO: Implementar llamada al servidor
            console.log("Datos de recepción:", data);
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