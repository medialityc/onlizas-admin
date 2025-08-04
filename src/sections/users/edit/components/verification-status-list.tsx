import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Label } from "@/components/label/label";
import { useState } from "react";
import LoaderButton from "@/components/loaders/loader-button";

interface VerificationStatusListProps {
    items: Array<{
        value: string;
        isVerified: boolean;
    }>;
    label: string;
    onVerify: (value: string) => Promise<void>;
}

export const VerificationStatusList = ({
    items,
    label,
    onVerify,
}: VerificationStatusListProps) => {
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

    const handleVerify = async (value: string) => {
        setLoadingItems(prev => new Set(prev).add(value));
        try {
            await onVerify(value);
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(value);
                return newSet;
            });
        }
    };

    return (
        <div>
            <Label className="text-sm font-semibold mb-2 block">{label}</Label>
            {items && items.length > 0 ? (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 dark:bg-black-dark-light  p-3 rounded "
                        >
                            <span className="text-sm">{item.value}</span>
                            {item.isVerified ? (
                                <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Verificado
                                </span>
                            ) : (
                                <LoaderButton
                                    type="button"                                    
                                    className="bg-sky-600 hover:bg-sky-700 text-white"
                                    onClick={() => handleVerify(item.value)}
                                    disabled={loadingItems.has(item.value)}
                                    loading={loadingItems.has(item.value)}
                                >
                                    {loadingItems.has(item.value) ? "Enviando..." : "Enviar Verificación"}
                                </LoaderButton>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm italic">
                    No hay {label.toLowerCase()} registrados
                </p>
            )}
        </div>
    );
};