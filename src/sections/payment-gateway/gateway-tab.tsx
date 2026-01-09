"use client";

import { Card, Tabs, Text, Title } from "@mantine/core";
import { GatewayFormSelector } from "./gateway-form-selector";
import { GatewaysManageList } from "./gateway-list";
import { GatewaysManageListRef } from "./gateway-list";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Estilos para el Card de Mantine con soporte de modo oscuro
const cardStyles = {
  root: {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--card-border)",
  },
};

// Estilos para los tabs con soporte de modo oscuro
const getTabStyles = (isActive: boolean) => ({
  tab: {
    backgroundColor: isActive ? "var(--tab-active-bg)" : "var(--tab-inactive-bg)",
    color: isActive ? "var(--tab-active-text)" : "var(--tab-inactive-text)",
  },
});

export const GatewaysTab = () => {
  const [tabActive, setTabActive] = useState<"configure" | "manage">(
    "configure"
  );
  const gatewaysListRef = useRef<GatewaysManageListRef>(null);

  return (
    <div className={cn(
      "space-y-6",
      // Card styles
      "[--card-bg:theme(colors-slate-100)] dark:[--card-bg:#121c2c]",
      "[--card-border:theme(colors-gray-200)] dark:[--card-border:theme(colors-gray-700)]",
      // Tab styles
      "[--tab-active-bg:theme(colors-gray-100)] dark:[--tab-active-bg:theme(colors-gray-700)]",
      "[--tab-active-text:theme(colors-gray-900)] dark:[--tab-active-text:theme(colors-white)]",
      "[--tab-inactive-bg:theme(colors-gray-300)] dark:[--tab-inactive-bg:theme(colors-gray-900)]",
      "[--tab-inactive-text:theme(colors-gray-700)] dark:[--tab-inactive-text:theme(colors-gray-300)]",
      "[--tab-hover-bg:theme(colors-gray-400)] dark:[--tab-hover-bg:theme(colors-gray-800)]"
    )}>
      <Tabs defaultValue="configure" className="space-y-6">
        <Tabs.List className="flex w-fit rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <Tabs.Tab
            value="configure"
            onClick={() => setTabActive("configure")}
            styles={getTabStyles(tabActive === "configure")}
            className={cn(
              "px-6 py-2 font-medium transition-all duration-300",
              tabActive !== "configure" && "hover:bg-gray-400! dark:hover:bg-gray-800!"
            )}
          >
            Configurar Pasarela
          </Tabs.Tab>

          <Tabs.Tab
            value="manage"
            onClick={() => setTabActive("manage")}
            styles={getTabStyles(tabActive === "manage")}
            className={cn(
              "px-6 py-2 font-medium transition-all duration-300",
              tabActive !== "manage" && "hover:bg-gray-400! dark:hover:bg-gray-800!"
            )}
          >
            Gestionar Existentes
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="configure">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            styles={cardStyles}
            className="shadow-lg transition-all duration-500 ease-in-out"
          >
            <Title order={4} className="text-gray-900 dark:text-gray-100">
              + Agregar Nueva Pasarela de Pago
            </Title>
            <Text c="dimmed" size="sm" mb="md" className="dark:text-gray-400">
              Configure las credenciales para un nuevo proveedor de pagos
            </Text>
            <GatewayFormSelector />
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="manage">
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
            <GatewaysManageList ref={gatewaysListRef} tabActive={tabActive} />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
