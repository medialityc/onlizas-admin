"use client";

import { Card, Tabs, Text, Title } from "@mantine/core";
import { GatewayFormSelector } from "./gateway-form-selector";
import { GatewaysManageList } from "./gateway-list";
import { GatewaysManageListRef } from "./gateway-list";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const GatewaysTab = () => {
  const [tabActive, setTabActive] = useState<"configure" | "manage">(
    "configure"
  );
  const gatewaysListRef = useRef<GatewaysManageListRef>(null);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="configure" className="space-y-6">
        <Tabs.List className="flex w-fit rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <Tabs.Tab
            value="configure"
            onClick={() => setTabActive("configure")}
            className={cn(
              "px-6 py-2 font-medium transition-all duration-300",
              tabActive === "configure"
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "bg-gray-300 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-800"
            )}
          >
            Configurar Pasarela
          </Tabs.Tab>

          <Tabs.Tab
            value="manage"
            onClick={() => setTabActive("manage")}
            className={cn(
              "px-6 py-2 font-medium transition-all duration-300",
              tabActive === "manage"
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "bg-gray-300 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-800"
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
            className="bg-slate-200/50 dark:bg-slate-950/50 shadow-lg transition-all duration-500 ease-in-out"
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
            radius="md"
            withBorder
            className="bg-slate-200/50 dark:bg-slate-950/50 shadow-lg transition-all duration-500 ease-in-out"
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
