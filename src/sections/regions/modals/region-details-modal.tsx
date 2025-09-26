"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import { Region } from "@/types/regions";
import { useQueryClient } from "@tanstack/react-query";
import RegionGeneralInfo from "./components/region-general-info";
import RegionCountriesSection from "./components/region-countries-section";
import RegionCurrencySection from "./components/region-currency-section";
import RegionPaymentSection from "./components/region-payment-section";
import RegionShippingSection from "./components/region-shipping-section";
import { useRegionDetails } from "../hooks/use-region-details";
import RegionConfigurationModal from "./region-configuration-modal";
import {
  InformationCircleIcon,
  GlobeAmericasIcon,
import {
    InformationCircleIcon,
    GlobeAmericasIcon,
    CurrencyDollarIcon,
    CreditCardIcon,
    TruckIcon,
  } from "@heroicons/react/24/outline";
import { usePermissions } from "zas-sso-client";

interface RegionDetailsModalProps {
  region: Region;
  open: boolean;
  onClose: () => void;
  loading?: boolean;
}

const tabs = [
  {
    id: "general",
    name: "General",
    icon: InformationCircleIcon,
    description: "Información básica",
  },
  {
    id: "countries",
    name: "Países",
    icon: GlobeAmericasIcon,
    description: "Países asociados",
  },
  {
    id: "currencies",
    name: "Monedas",
    icon: CurrencyDollarIcon,
    description: "Configuración de monedas",
  },
  {
    id: "payments",
    name: "Pagos",
    icon: CreditCardIcon,
    description: "Gateways de pago",
  },
  {
    id: "shipping",
    name: "Envíos",
    icon: TruckIcon,
    description: "Métodos de envío",
  },
];

export function RegionDetailsModal({
  region,
  open,
  onClose,
  loading: externalLoading = false,
}: RegionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("general");

  const queryClient = useQueryClient();

  const [configModal, setConfigModal] = useState<{
    open: boolean;
    type: "currencies" | "payments" | "shipping" | null;
  }>({
    open: false,
    type: null,
  });

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canEdit = hasPermission(["UPDATE_ALL"]);
  const canDelete = hasPermission(["DELETE_ALL"]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <RegionGeneralInfo region={fullRegion} />;
      case "countries":
        return <RegionCountriesSection region={fullRegion} />;
      case "currencies":
        return (
          <RegionCurrencySection
            region={fullRegion}
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
          <RegionShippingSection
            region={fullRegion}
            canEdit={canEdit}
            canDelete={canDelete}
            onOpenConfig={handleOpenConfig}
          />
        );
      default:
        return <RegionGeneralInfo region={fullRegion} />;
    }
  };

  return (
    <SimpleModal
      title={`Detalles de ${region.name}`}
      loading={isLoading}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col h-[80vh]">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 pt-6">
          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  <Icon
                    className={`-ml-0.5 mr-2 h-5 w-5 ${isActive
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                      }`}
                  />
                  <span>{tab.name}</span>
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
            onClick={() => queryClient.invalidateQueries({ queryKey: ["regions"] })}
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
        initialTab={configModal.type || 'currencies'}
        onSuccess={() => {
          // Refrescar datos después de una acción exitosa
          queryClient.invalidateQueries({ queryKey: ["regions"] });
          queryClient.invalidateQueries({ queryKey: ["region-details", region.id] });
        }}
      />
    </SimpleModal>
  );
}
