"use client";

import { useState } from "react";
import { TransferReception } from "@/types/warehouse-transfer-receptions";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import ReceptionProductsTab from "../components/warehouse-reception/reception-products-tab";
import ReceptionDiscrepanciesTab from "../components/warehouse-reception/reception-discrepancies-tab";
import ReceptionDocumentationTab from "../components/warehouse-reception/reception-documentation-tab";
import { Button } from "@/components/button/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";

const receptionTabs = [
  {
    label: "Recepción de Productos",
    href: "#products",
    icon: "package",
  },
  {
    label: "Gestión de Incidencias",
    href: "#discrepancies",
    icon: "exclamationTriangle",
  },
  {
    label: "Documentación",
    href: "#documentation",
    icon: "document",
  },
];

interface Props {
  warehouse: WarehouseFormData;
  reception: TransferReception;
}

export default function WarehouseReceptionProcessContainer({
  warehouse,
  reception,
}: Props) {
  const [activeTab, setActiveTab] = useState("products");
  const router = useRouter();
  const pathname = usePathname();

  const handleBackToTransfers = () => {
    // Construir la ruta de vuelta a transferencias
    // pathname será algo como: /dashboard/warehouses/[type]/[id]/reception/[transferId]
    const pathParts = pathname.split('/');
    const typeIndex = pathParts.indexOf('warehouses') + 1;
    const idIndex = typeIndex + 1;

    if (typeIndex > 0 && idIndex < pathParts.length) {
      const type = pathParts[typeIndex];
      const warehouseId = pathParts[idIndex];
      const transfersPath = `/dashboard/warehouses/${type}/${warehouseId}/edit/transfers/list`;
      router.push(transfersPath);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "products":
        return <ReceptionProductsTab reception={reception} warehouse={warehouse} />;
      case "discrepancies":
        return <ReceptionDiscrepanciesTab reception={reception} warehouse={warehouse} />;
      case "documentation":
        return <ReceptionDocumentationTab reception={reception} warehouse={warehouse} />;
      default:
        return <ReceptionProductsTab reception={reception} warehouse={warehouse} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de la recepción */}
      <div className="panel">
        {/* Botón de navegación hacia atrás */}
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={handleBackToTransfers} variant="secondary" outline>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a Transferencias
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white-light">
              Recepción de Transferencia
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona la recepción de mercancía y registra cualquier discrepancia
            </p>
          </div>

          <div className="text-right">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {reception.transferNumber}
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-300">
                Transferencia desde {reception.originWarehouseName}
              </p>
            </div>
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Origen</p>
            <p className="font-medium text-dark dark:text-white-light">
              {reception.originWarehouseName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Destino</p>
            <p className="font-medium text-dark dark:text-white-light">
              {reception.destinationWarehouseName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de Envío</p>
            <p className="font-medium text-dark dark:text-white-light">
              {new Date(reception.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="panel">
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {receptionTabs.map((tab) => (
              <button
                key={tab.href}
                onClick={() => setActiveTab(tab.href.replace("#", ""))}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.href.replace("#", "")
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {renderActiveTab()}
      </div>
    </div>
  );
}