"use client";

import { Card, Text, Title } from "@mantine/core";
import { GatewaysManageList } from "./gateway-list";
import { GatewaysManageListRef } from "./gateway-list";
import { useRef } from "react";

// Estilos para el Card de Mantine con soporte de modo oscuro
const cardStyles = {
  root: {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--card-border)",
  },
};

export const GatewaysTab = () => {
  const gatewaysListRef = useRef<GatewaysManageListRef>(null);

  return (
    <div className="space-y-6 [--card-bg:theme(colors.slate.100)] dark:[--card-bg:#121c2c] [--card-border:theme(colors.gray.200)] dark:[--card-border:theme(colors.gray.700)]">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        styles={cardStyles}
        className="shadow-lg transition-all duration-500 ease-in-out"
      >
        <Title order={4} className="text-gray-900 dark:text-gray-100">
          Pasarelas Existentes
        </Title>
        <Text c="dimmed" size="sm" mb="md" className="dark:text-gray-400">
          Gestione sus pasarelas de pago configuradas
        </Text>
        <GatewaysManageList ref={gatewaysListRef} />
      </Card>
    </div>
  );
};
