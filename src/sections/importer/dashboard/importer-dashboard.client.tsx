"use client";

import { useState } from "react";
import type { ImporterData } from "@/services/importer-portal";
import { logoutImporter } from "@/services/importer-access";
import { useRouter } from "next/navigation";
import SessionTimer from "@/components/importer/session-timer";
import showToast from "@/config/toast/toastConfig";
import {
  Card,
  Title,
  Text,
  ScrollArea,
  Button,
  Stack,
  Group,
  Badge,
  Accordion,
} from "@mantine/core";

interface Props {
  importer: ImporterData;
  expiresAt: number;
}

export default function ImporterDashboardClient({
  importer,
  expiresAt,
}: Props) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutImporter();
      showToast("Sesión cerrada exitosamente", "success");
      router.push(`/importadora/${importer.importerId}`);
    } catch (error) {
      showToast("Error al cerrar sesión", "error");
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e1726]">
      <div className="border-b border-white-light dark:border-[#1b2e4b]">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-6 px-4">
            <div>
              <Title order={2} className="text-black dark:text-white">
                {importer.importerName}
              </Title>
              <Text size="sm" c="dimmed" mt={4}>
                Importadora ID: {importer.importerId}
              </Text>
              {!importer.isActive && (
                <Badge color="red" variant="filled" mt={4}>
                  Inactiva
                </Badge>
              )}
            </div>
            <Group gap="md">
              <SessionTimer expiresAt={expiresAt} />
              <Button onClick={handleLogout} loading={isLoggingOut} color="red">
                Cerrar Sesión
              </Button>
            </Group>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contratos/Proveedores */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Contratos ({importer.contracts.length})
            </Title>
            <ScrollArea h={600}>
              <Stack gap="sm">
                {importer.contracts.length > 0 ? (
                  importer.contracts.map((contract) => (
                    <Card key={contract.id} padding="md" radius="md" withBorder>
                      <Group justify="space-between" mb="xs">
                        <Text fw={500}>
                          {contract.approvalProcessUser?.userName ||
                            contract.approvalProcessName}
                        </Text>
                        <Badge
                          color={
                            contract.status === "Approved"
                              ? "green"
                              : contract.status === "Pending"
                                ? "yellow"
                                : "gray"
                          }
                          variant="filled"
                        >
                          {contract.status}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Proceso: {contract.approvalProcessName}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Desde:{" "}
                        {new Date(contract.startDate).toLocaleDateString()}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Hasta: {new Date(contract.endDate).toLocaleDateString()}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <Text c="dimmed" ta="center" py="xl">
                    No hay contratos disponibles
                  </Text>
                )}
              </Stack>
            </ScrollArea>
          </Card>

          {/* Nomencladores */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Nomencladores ({importer.nomenclators.length})
            </Title>
            <ScrollArea h={600}>
              <Stack gap="sm">
                {importer.nomenclators.length > 0 ? (
                  importer.nomenclators.map((nomenclator) => (
                    <Card
                      key={nomenclator.id}
                      padding="md"
                      radius="md"
                      withBorder
                    >
                      <Group justify="space-between" mb="xs">
                        <Text fw={500}>{nomenclator.name}</Text>
                        <Badge
                          color={nomenclator.isActive ? "green" : "gray"}
                          variant="filled"
                        >
                          {nomenclator.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed" mb="md">
                        Creado:{" "}
                        {new Date(nomenclator.createdAt).toLocaleDateString()}
                      </Text>

                      {nomenclator.categories.length > 0 && (
                        <Accordion variant="contained">
                          {nomenclator.categories.map((category) => (
                            <Accordion.Item
                              key={category.id}
                              value={category.id}
                            >
                              <Accordion.Control>
                                <Group>
                                  <Text size="sm" fw={500}>
                                    {category.name}
                                  </Text>
                                  {category.active && (
                                    <Badge size="sm" color="green">
                                      Activo
                                    </Badge>
                                  )}
                                </Group>
                              </Accordion.Control>
                              <Accordion.Panel>
                                <Stack gap="xs">
                                  <Text size="xs" c="dimmed">
                                    {category.description}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    Departamento: {category.departmentName}
                                  </Text>
                                  {category.features.length > 0 && (
                                    <div>
                                      <Text size="xs" fw={500} mt="xs" mb="xs">
                                        Características:
                                      </Text>
                                      {category.features.map((feature) => (
                                        <Badge
                                          key={feature.featureId}
                                          size="sm"
                                          mr={4}
                                          mb={4}
                                          color={
                                            feature.isRequired ? "red" : "blue"
                                          }
                                          variant={
                                            feature.isPrimary
                                              ? "filled"
                                              : "outline"
                                          }
                                        >
                                          {feature.featureName}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </Stack>
                              </Accordion.Panel>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      )}
                    </Card>
                  ))
                ) : (
                  <Text c="dimmed" ta="center" py="xl">
                    No hay nomencladores disponibles
                  </Text>
                )}
              </Stack>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
