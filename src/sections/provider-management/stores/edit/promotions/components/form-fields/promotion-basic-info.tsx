import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormInput, FormTextarea, FormToggle } from "./index";
import { Button } from "@/components/button/button";
import { generatePromotionCode } from "@/services/promotions";
import { toast } from "react-toastify";

export default function PromotionBasicInfo({
    codeLabel = "Código promocional",
    typeLabel,
    showCode = true,
}: {
    codeLabel?: string;
    typeLabel?: string;
    showCode?: boolean;
}) {
    const { setValue } = useFormContext();
    // Mostrar tipo si se pasa por props: inyectar en el read-only field value
    useEffect(() => {
        if (typeLabel !== undefined) setValue("_typeLabel", typeLabel);
    }, [typeLabel, setValue]);

    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await generatePromotionCode();
            if (res?.data) {
                setValue("code", res.data);
                toast.success("Código generado exitosamente");
            } else {
                const fallback = `CODIGO${Date.now()}`;
                setValue("code", fallback);
                toast.info("Código generado localmente");
            }
        } catch (err) {
            const fallback = `CODIGO${Date.now()}`;
            setValue("code", fallback);
            toast.info("Código generado localmente");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-900">Información básica</h3>
            <div className="mt-4">
                <FormToggle name="isActive" label="Activo" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <FormInput name="name" label="Título" required placeholder="Ej: Envío gratis en compras superiores a $50" />
                </div>

                {/* Mostrar tipo de promoción (solo lectura) si nos lo pasan */}
                <div className="md:col-span-1">
                    <FormInput
                        name="_typeLabel"
                        label="Tipo de promoción"                        
                        readOnly
                    />
                </div>
            </div>

            {/* Código y generar (controlado por prop showCode) */}
            {showCode && (
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-end gap-2">
                        <div className="flex-1 md:pr-2">
                            <FormInput name="code" required label={codeLabel} placeholder="Ej: CODIGO2025" />
                        </div>
                        <div className="flex-shrink-0">
                            <Button type="button" size="md" variant="secondary" onClick={handleGenerate} disabled={generating}>
                                {generating ? "Generando..." : "Generar"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <FormTextarea name="description" label="Descripción" required rows={3} placeholder="Breve descripción de la promoción" />
        </div>
    );
}
