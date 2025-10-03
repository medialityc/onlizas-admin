"use client";

import { Button } from "@/components/button/button";
import { WarehouseTransfer } from "@/types/warehouses-transfers";

import ProductReceptionTab from "./product-reception-tab";

import IncidentsManagementTab from "./incidents-management-tab";
import DocumentationTab from "./documentation-tab";

interface Props {
    activeTab: string;
    onTabChange: (tab: string) => void;
    transfer: WarehouseTransfer;
    isSubmitting: boolean;
    onSaveDraft: () => void;
}

const tabs = [
    { id: "reception", label: "Recepción de Productos" },
    { id: "incidents", label: "Gestión de Incidencias" },
    { id: "documentation", label: "Documentación" },
];

export default function TransferReceptionTabs({
    activeTab,
    onTabChange,
    transfer,
    isSubmitting,
    onSaveDraft,
}: Props) {
    return (
        <div className="space-y-6">
            {/* Navegación de tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenido de los tabs */}
            <div className="space-y-6">
                {activeTab === "reception" && (
                    <ProductReceptionTab
                        transfer={transfer}
                        isSubmitting={isSubmitting}
                        onSaveDraft={onSaveDraft}
                    />
                )}

                {activeTab === "incidents" && (
                    <IncidentsManagementTab
                        transfer={transfer}
                    />
                )}

                {activeTab === "documentation" && (
                    <DocumentationTab
                        transfer={transfer}
                    />
                )}
            </div>
        </div>
    );
}