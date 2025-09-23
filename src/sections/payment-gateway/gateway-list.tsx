"use client";
import { gateways } from "@/services/data-for-gateway-settings/mock-datas";
import { useState } from "react";
import { GatewayCard } from "./gateway-card";

export const GatewaysManageList = () => {
  const [showCredentials, setShowCredentials] = useState<
    Record<string, boolean>
  >({});

  const toggleCredentialVisibility = (id: string|number) => {
    setShowCredentials((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {gateways.map((gateway) => (
        <GatewayCard
          key={gateway.id}
          gateway={gateway}
          showCredentials={!!showCredentials[gateway.id]}
          toggleCredentialVisibility={() =>
            toggleCredentialVisibility(gateway.id)
          }
        />
      ))}
    </div>
  );
};
