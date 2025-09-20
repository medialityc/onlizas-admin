"use client";

import SimpleModal from "@/components/modal/modal";
import { Region } from "@/types/regions";
import { useQuery } from "@tanstack/react-query";
import { getRegionById } from "@/services/regions";
import RegionGeneralInfo from "./components/region-general-info";
import RegionCountriesSection from "./components/region-countries-section";
import RegionCurrencySection from "./components/region-currency-section";
import RegionPaymentSection from "./components/region-payment-section";
import RegionShippingSection from "./components/region-shipping-section";

interface RegionDetailsModalProps {
  region: Region;
  open: boolean;
  onClose: () => void;
  loading?: boolean;
}

export function RegionDetailsModal({
  region,
  open,
  onClose,
  loading: externalLoading = false,
}: RegionDetailsModalProps) {
    // Obtener los datos completos de la región incluyendo configuraciones
  const { data: regionData, isLoading: isLoadingRegion } = useQuery({
    queryKey: ["region-details", region.id],
    queryFn: () => getRegionById(region.id),
    enabled: open && !!region.id,
  });
  const fullRegion = regionData?.data || region;
  const isLoading = externalLoading || isLoadingRegion;
 
  // Helper functions to check if sections have data
  const hasCurrencyData = fullRegion.currencyConfig && (
    fullRegion.currencyConfig.allCurrencies?.length > 0 || 
    fullRegion.currencyConfig.primaryCurrency
  );
  
  const hasPaymentData = fullRegion.paymentConfig && (
    fullRegion.paymentConfig.gateways?.length > 0 || 
    fullRegion.paymentConfig.fallbackGateway
  );
  
  const hasShippingData = fullRegion.shippingConfig && (
    fullRegion.shippingConfig.methods?.length > 0 ||
    (fullRegion.shippingConfig.minBaseCost !== null && fullRegion.shippingConfig.maxBaseCost !== null)
  );

  return (
    <SimpleModal
      title={`Detalles de ${region.name}`}
      loading={isLoading}
      open={open}
      onClose={onClose}
    >
      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <RegionGeneralInfo region={fullRegion} />
        
        {/* Países asociados - mostrar siempre, incluso si está vacío */}
        <RegionCountriesSection region={fullRegion} />
        
        {/* Nuevas secciones con información detallada - solo mostrar si tienen datos */}
        {hasCurrencyData && <RegionCurrencySection region={fullRegion} />}
        {hasPaymentData && <RegionPaymentSection region={fullRegion} />}
        {hasShippingData && <RegionShippingSection region={fullRegion} />}

        {/* Si no hay configuraciones disponibles */}
        {!hasCurrencyData && !hasPaymentData && !hasShippingData && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              <svg className="mx-auto h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              No hay configuraciones adicionales disponibles para esta región.
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );

}
