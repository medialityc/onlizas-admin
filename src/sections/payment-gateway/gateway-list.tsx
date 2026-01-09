import { useQuery } from "@tanstack/react-query";
import { getAllGateways } from "@/services/gateways";
import showToast from "@/config/toast/toastConfig";
import { Gateway } from "@/types";
import { useState, forwardRef, useImperativeHandle } from "react";
import { GatewayCard } from "./gateway-card";

export interface GatewaysManageListRef {
  refreshGateways: () => Promise<void>;
}

export const GatewaysManageList = forwardRef<
  GatewaysManageListRef,
  {
    tabActive: "configure" | "manage";
    onRefresh?: () => void;
  }
>(({ tabActive, onRefresh }, ref) => {
  const [showCredentials, setShowCredentials] = useState<
    Record<string, boolean>
  >({});

  // Usar React Query para manejar el estado del servidor
  const {
    data: gatewaysResponse,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["gateways"],
    queryFn: async () => {
      const response = await getAllGateways();      
      if (response.error) {
        showToast("Error al cargar las pasarelas", "error");
        throw new Error("Error al cargar las pasarelas");
      }
      return response.data;
    },
    enabled: tabActive === "manage", // Solo fetch cuando estamos en la tab manage
  });

  const gateways = (gatewaysResponse as Gateway[]) || [];

  const toggleCredentialVisibility = (id: string) => {
    setShowCredentials((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Exponer la función refreshGateways (ahora usa refetch de React Query)
  useImperativeHandle(ref, () => ({
    refreshGateways: async () => {
      await refetch();
    },
  }));

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : (
        gateways.map((gateway: Gateway) => (
          <GatewayCard
            key={gateway.id}
            gateway={gateway}
            showCredentials={!!showCredentials[gateway.id]}
            toggleCredentialVisibility={() =>
              toggleCredentialVisibility(gateway.id)
            }
          />
        ))
      )}
    </div>
  );
});

export default GatewaysManageList;
