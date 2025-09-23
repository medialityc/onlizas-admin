"use client";

import { useState } from "react";
import SimpleModal from "@/components/modal/modal";
import { Region } from "@/types/regions";
import { useQueryClient } from "@tanstack/react-query";
import RegionGeneralInfo from "../components/region-general-info";
import RegionCountriesSection from "../components/region-countries-section";
import { useRegionDetails } from "../../hooks/use-region-details";
import { 
  InformationCircleIcon, 
  GlobeAmericasIcon, 
  CurrencyDollarIcon,
  CreditCardIcon,
  TruckIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

interface RegionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  region: Region;
  loading?: boolean;
}

export default function RegionDetailsModal({
  open,
  onClose,
  region,
  loading: externalLoading = false
}: RegionDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('general');

  const queryClient = useQueryClient();

  // Obtener los datos completos de la región incluyendo configuraciones
  const { data: regionData, isLoading: isLoadingRegion } = useRegionDetails(
    region.id,
    open
  );

  const fullRegion = regionData?.data || region;
  const isLoading = externalLoading || isLoadingRegion;

  const tabs = [
    { 
      id: 'general', 
      label: 'General', 
      icon: InformationCircleIcon,
      description: 'Información básica de la región'
    },
    { 
      id: 'countries', 
      label: 'Países', 
      icon: GlobeAmericasIcon,
      description: 'Países incluidos en esta región',
      count: fullRegion.countries?.length || 0
    },
    { 
      id: 'currencies', 
      label: 'Monedas', 
      icon: CurrencyDollarIcon,
      description: 'Monedas disponibles en la región',
      count: fullRegion.currencyConfig?.enabledCount || 0
    },
    { 
      id: 'payments', 
      label: 'Pagos', 
      icon: CreditCardIcon,
      description: 'Métodos de pago configurados',
      count: fullRegion.paymentConfig?.enabledCount || 0
    },
    { 
      id: 'shipping', 
      label: 'Envíos', 
      icon: TruckIcon,
      description: 'Métodos de envío disponibles',
      count: fullRegion.shippingConfig?.enabledCount || 0
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <RegionGeneralInfo region={fullRegion} />;
      case 'countries':
        return <RegionCountriesSection region={fullRegion}  />;
      case 'currencies':
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Configuración de Monedas</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Vista de Solo Lectura</p>
              <p>Esta es una vista de detalles. Para configurar monedas, usa el botón "Configurar" en la lista de regiones.</p>
            </div>
            {fullRegion.currencyConfig && fullRegion.currencyConfig.allCurrencies ? (
              <div className="space-y-2">
                {fullRegion.currencyConfig.allCurrencies.map((currency: any) => (
                  <div key={currency.currencyId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{currency.name} ({currency.code})</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Símbolo: {currency.symbol} | Tasa: {currency.rate}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {currency.isEnabled && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                            Habilitada
                          </span>
                        )}
                        {currency.isPrimary && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                            Principal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay monedas configuradas</p>
            )}
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Configuración de Pagos</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Vista de Solo Lectura</p>
              <p>Esta es una vista de detalles. Para configurar métodos de pago, usa el botón "Configurar" en la lista de regiones.</p>
            </div>
            {fullRegion.paymentConfig && fullRegion.paymentConfig.gateways ? (
              <div className="space-y-2">
                {fullRegion.paymentConfig.gateways.map((gateway: any) => (
                  <div key={gateway.paymentGatewayId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{gateway.name} ({gateway.code})</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Prioridad: {gateway.priority} | Métodos: {gateway.supportedMethods?.join(', ') || 'N/A'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {gateway.isEnabled && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                            Habilitada
                          </span>
                        )}
                        {gateway.isFallback && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                            Respaldo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay métodos de pago configurados</p>
            )}
          </div>
        );
      case 'shipping':
        return (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Configuración de Envíos</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">Vista de Solo Lectura</p>
              <p>Esta es una vista de detalles. Para configurar métodos de envío, usa el botón "Configurar" en la lista de regiones.</p>
            </div>
            {fullRegion.shippingConfig && fullRegion.shippingConfig.methods ? (
              <div className="space-y-2">
                {fullRegion.shippingConfig.methods.map((method: any) => (
                  <div key={method.shippingMethodId} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{method.name} ({method.code})</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Transportista: {method.carrier} | Costo: ${method.baseCost?.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tiempo estimado: {method.estimatedDaysMin}-{method.estimatedDaysMax} días
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {method.isEnabled && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs">
                            Habilitado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No hay métodos de envío configurados</p>
            )}
          </div>
        );
      default:
        return <RegionGeneralInfo region={fullRegion} />;
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      loading={isLoading}
      title={
        <div className="flex items-center space-x-2">
          <EyeIcon className="h-5 w-5 text-gray-600" />
          <span>Detalles de Región: {region.name}</span>
        </div>
      }
    >
      <div className="flex flex-col h-[80vh] max-w-6xl mx-auto">
        {/* Header con tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Vista de solo lectura de la información de la región
          </div>
          
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${isActive 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end bg-gray-50 dark:bg-gray-800/50">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}