"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import { Region } from "@/types/regions";
import { useQueryClient } from "@tanstack/react-query";
import RegionCurrencySection from "../components/region-currency-section";
import RegionPaymentSection from "../components/region-payment-section";
import RegionShippingSection from "../components/region-shipping-section";
import { useRegionDetails } from "../../hooks/use-region-details";
import RegionConfigurationModal from "../region-configuration-modal";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  TruckIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface RegionConfigModalProps {
  open: boolean;
  onClose: () => void;
  region: Region;
  loading?: boolean;
}

export default function RegionConfigModal({
  open,
  onClose,
  region,
  loading: externalLoading = false,
}: RegionConfigModalProps) {
  const [activeTab, setActiveTab] = useState("currencies");
  const [configModal, setConfigModal] = useState<{
    open: boolean;
    type: "currencies" | "payments" | "shipping" | null;
  }>({
    open: false,
    type: null,
  });

  const queryClient = useQueryClient();

  // Control de permisos
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const canDelete = hasPermission([PERMISSION_ENUM.DELETE]);

  // Obtener los datos completos de la región incluyendo configuraciones
  const { data: regionData, isLoading: isLoadingRegion } = useRegionDetails(
    region.id,
    open
  );

  const fullRegion = regionData?.data || region;
  const isLoading = externalLoading || isLoadingRegion;

  const handleOpenConfig = (type: "currencies" | "payments" | "shipping") => {
    setConfigModal({ open: true, type });
  };

  const handleCloseConfig = () => {
    setConfigModal({ open: false, type: null });
  };

  const tabs = [
    {
      id: "currencies",
      label: "Monedas",
      icon: CurrencyDollarIcon,
      count: fullRegion.currencyConfig?.enabledCount || 0,
    },
    {
      id: "payments",
      label: "Pagos",
      icon: CreditCardIcon,
      count: fullRegion.paymentConfig?.enabledCount || 0,
    },
    {
      id: "shipping",
      label: "Envíos",
      icon: TruckIcon,
      count: fullRegion.shippingConfig?.enabledCount || 0,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "currencies":
        return (
          <RegionCurrencySection
            region={fullRegion}
            canEdit={canEdit}
            canDelete={canDelete}
            onOpenConfig={handleOpenConfig}
          />
        );
      case "payments":
        return (
          <RegionPaymentSection
            region={fullRegion}
            canEdit={canEdit}
            canDelete={canDelete}
            onOpenConfig={handleOpenConfig}
          />
        );
      case "shipping":
        return (
          <RegionShippingSection
            region={fullRegion}
            canEdit={canEdit}
            canDelete={canDelete}
            onOpenConfig={handleOpenConfig}
          />
        );
      default:
        return (
          <RegionCurrencySection
            region={fullRegion}
            canEdit={canEdit}
            canDelete={canDelete}
            onOpenConfig={handleOpenConfig}
          />
        );
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      loading={isLoading}
      title={
        <div className="flex items-center space-x-2">
          <CogIcon className="h-5 w-5 text-blue-600" />
          <span>Configurar Región: {region.name}</span>
        </div>
      }
    >
      <div className="flex flex-col h-[80vh] max-w-6xl mx-auto">
        {/* Header con tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Configura las monedas, métodos de pago y envío disponibles en esta
            región
          </div>

          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                    ${
                      active
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${
                      active
                        ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderTabContent()}</div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["regions"] })
            }
            className="btn btn-outline-primary"
          >
            Actualizar Datos
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de configuración */}
      <RegionConfigurationModal
        open={configModal.open}
        onClose={handleCloseConfig}
        region={fullRegion}
        initialTab={configModal.type || "currencies"}
      />
    </SimpleModal>
  );
}
