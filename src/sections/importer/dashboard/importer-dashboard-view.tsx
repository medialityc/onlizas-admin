"use client";

import { Paper, Text, SimpleGrid, Group, ThemeIcon, Progress, Stack, Badge, RingProgress, Center } from "@mantine/core";
import { TagIcon as TagIconSolid, UsersIcon as UsersIconSolid, DocumentTextIcon as DocumentTextIconSolid, ClockIcon as ClockIconSolid, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useImporterData } from "@/contexts/importer-data-context";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    positive: boolean;
  };
}

function StatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
  return (
    <Paper
      p="xl"
      radius="lg"
      withBorder
      className="hover:shadow-lg transition-shadow duration-200"
      styles={{
        root: {
          backgroundColor: "light-dark(#ffffff, #1b2e4b)",
          borderColor: "light-dark(#e5e7eb, #253a54)",
        },
      }}
    >
      <Group justify="space-between" align="flex-start" mb="md">
        <ThemeIcon
          size={56}
          radius="md"
          variant="light"
          color={color}
        >
          {icon}
        </ThemeIcon>
        {trend && (
          <Badge
            size="sm"
            color={trend.positive ? "teal" : "red"}
            variant="light"
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </Badge>
        )}
      </Group>
      <Text size="xs" c="dimmed" mb={4} className="uppercase tracking-wide font-semibold">
        {title}
      </Text>
      <Text size="32px" fw={700} className="text-gray-900 dark:text-white" mb={4}>
        {value}
      </Text>
      {subtitle && (
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      )}
    </Paper>
  );
}

interface Props {
  importerId: string;
}

export default function ImporterDashboardView({ importerId }: Props) {
  const { importerData } = useImporterData();
  
  const activeNomenclators = importerData?.nomenclators?.filter((n) => n.isActive).length || 0;
  const totalNomenclators = importerData?.nomenclators?.length || 0;
  const inactiveNomenclators = totalNomenclators - activeNomenclators;
  
  const activeContracts = importerData?.contracts?.filter((c) => {
    const status = c.status?.toUpperCase();
    return status === "APPROVED" || status === "ACTIVE";
  }).length || 0;
  
  const pendingContracts = importerData?.contracts?.filter((c) => {
    const status = c.status?.toUpperCase();
    return status === "PENDING";
  }).length || 0;
  
  const rejectedContracts = importerData?.contracts?.filter((c) => {
    const status = c.status?.toUpperCase();
    return status === "REJECTED";
  }).length || 0;
  
  const expiringContracts = importerData?.contracts?.filter((c) => {
    if (!c.endDate) return false;
    const endDate = new Date(c.endDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length || 0;

  const totalContracts = importerData?.contracts?.length || 0;
  const nomenclatorProgress = totalNomenclators > 0 ? (activeNomenclators / totalNomenclators) * 100 : 0;
  const contractApprovalRate = totalContracts > 0 ? (activeContracts / totalContracts) * 100 : 0;

  return (
    <div>
      <div className="mb-8">
        <Text size="28px" fw={700} className="text-gray-900 dark:text-white mb-2">
          Dashboard
        </Text>
        <Text size="md" c="dimmed">
          Vista general de tu actividad como importadora
        </Text>
      </div>

      {/* Stats principales */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        <StatCard
          title="Nomencladores Activos"
          value={activeNomenclators}
          subtitle={totalNomenclators > activeNomenclators ? `${inactiveNomenclators} inactivos de ${totalNomenclators} totales` : `${totalNomenclators} totales`}
          icon={<TagIconSolid className="h-7 w-7" />}
          color="teal"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Contratos Activos"
          value={activeContracts}
          subtitle={`${totalContracts} contratos totales`}
          icon={<UsersIconSolid className="h-7 w-7" />}
          color="blue"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={pendingContracts}
          subtitle="Requieren tu revisión"
          icon={<DocumentTextIconSolid className="h-7 w-7" />}
          color="yellow"
        />
        <StatCard
          title="Contratos por Vencer"
          value={expiringContracts}
          subtitle="En los próximos 30 días"
          icon={<ClockIconSolid className="h-7 w-7" />}
          color="red"
        />
      </SimpleGrid>

      {/* Cards de análisis */}
      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
        {/* Progress de nomencladores */}
        <Paper
          p="xl"
          radius="lg"
          withBorder
          styles={{
            root: {
              backgroundColor: "light-dark(#ffffff, #1b2e4b)",
              borderColor: "light-dark(#e5e7eb, #253a54)",
            },
          }}
        >
          <Group justify="space-between" mb="lg">
            <div>
              <Text size="sm" fw={600} className="text-gray-900 dark:text-white mb-1">
                Estado de Nomencladores
              </Text>
              <Text size="xs" c="dimmed">
                Activos vs Total
              </Text>
            </div>
            <ThemeIcon size={42} radius="md" variant="light" color="teal">
              <TagIconSolid className="h-6 w-6" />
            </ThemeIcon>
          </Group>
          
          <Center>
            <RingProgress
              size={150}
              thickness={16}
              roundCaps
              sections={[
                { value: nomenclatorProgress, color: 'teal' },
              ]}
              label={
                <Center>
                  <div className="text-center">
                    <Text size="xl" fw={700} className="text-gray-900 dark:text-white">
                      {Math.round(nomenclatorProgress)}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      Activos
                    </Text>
                  </div>
                </Center>
              }
            />
          </Center>

          <Group justify="space-between" mt="lg">
            <Group gap="xs">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <Text size="xs" c="dimmed">Activos: {activeNomenclators}</Text>
            </Group>
            <Group gap="xs">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
              <Text size="xs" c="dimmed">Inactivos: {inactiveNomenclators}</Text>
            </Group>
          </Group>
        </Paper>

        {/* Tasa de aprobación */}
        <Paper
          p="xl"
          radius="lg"
          withBorder
          styles={{
            root: {
              backgroundColor: "light-dark(#ffffff, #1b2e4b)",
              borderColor: "light-dark(#e5e7eb, #253a54)",
            },
          }}
        >
          <Group justify="space-between" mb="lg">
            <div>
              <Text size="sm" fw={600} className="text-gray-900 dark:text-white mb-1">
                Tasa de Aprobación
              </Text>
              <Text size="xs" c="dimmed">
                Contratos aprobados
              </Text>
            </div>
            <ThemeIcon size={42} radius="md" variant="light" color="blue">
              <CheckCircleIcon className="h-6 w-6" />
            </ThemeIcon>
          </Group>

          <div className="mb-lg">
            <Text size="40px" fw={700} className="text-gray-900 dark:text-white mb-2">
              {Math.round(contractApprovalRate)}%
            </Text>
            <Progress
              value={contractApprovalRate}
              color="blue"
              size="lg"
              radius="xl"
            />
          </div>

          <Stack gap="xs" mt="lg">
            <Group justify="space-between">
              <Group gap="xs">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <Text size="xs" c="dimmed">Aprobados</Text>
              </Group>
              <Text size="xs" fw={600} className="text-gray-900 dark:text-white">
                {activeContracts}
              </Text>
            </Group>
            <Group justify="space-between">
              <Group gap="xs">
                <ClockIconSolid className="h-4 w-4 text-yellow-500" />
                <Text size="xs" c="dimmed">Pendientes</Text>
              </Group>
              <Text size="xs" fw={600} className="text-gray-900 dark:text-white">
                {pendingContracts}
              </Text>
            </Group>
            <Group justify="space-between">
              <Group gap="xs">
                <XCircleIcon className="h-4 w-4 text-red-500" />
                <Text size="xs" c="dimmed">Rechazados</Text>
              </Group>
              <Text size="xs" fw={600} className="text-gray-900 dark:text-white">
                {rejectedContracts}
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* Alertas importantes */}
        <Paper
          p="xl"
          radius="lg"
          withBorder
          styles={{
            root: {
              backgroundColor: "light-dark(#ffffff, #1b2e4b)",
              borderColor: "light-dark(#e5e7eb, #253a54)",
            },
          }}
        >
          <Group justify="space-between" mb="lg">
            <div>
              <Text size="sm" fw={600} className="text-gray-900 dark:text-white mb-1">
                Alertas Importantes
              </Text>
              <Text size="xs" c="dimmed">
                Requieren atención
              </Text>
            </div>
            <ThemeIcon size={42} radius="md" variant="light" color="orange">
              <ClockIconSolid className="h-6 w-6" />
            </ThemeIcon>
          </Group>

          <Stack gap="md">
            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: pendingContracts > 0 ? "rgba(250, 204, 21, 0.1)" : "rgba(107, 114, 128, 0.1)",
                border: pendingContracts > 0 ? "1px solid rgba(250, 204, 21, 0.3)" : "1px solid rgba(107, 114, 128, 0.2)"
              }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="sm" fw={600} className="text-gray-900 dark:text-white mb-1">
                    Solicitudes Pendientes
                  </Text>
                  <Text size="xs" c="dimmed">
                    Revisa las nuevas solicitudes
                  </Text>
                </div>
                <Badge
                  size="lg"
                  color={pendingContracts > 0 ? "yellow" : "gray"}
                  variant="filled"
                >
                  {pendingContracts}
                </Badge>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="md"
              style={{
                backgroundColor: expiringContracts > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(107, 114, 128, 0.1)",
                border: expiringContracts > 0 ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(107, 114, 128, 0.2)"
              }}
            >
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text size="sm" fw={600} className="text-gray-900 dark:text-white mb-1">
                    Contratos por Vencer
                  </Text>
                  <Text size="xs" c="dimmed">
                    Próximos a expirar
                  </Text>
                </div>
                <Badge
                  size="lg"
                  color={expiringContracts > 0 ? "red" : "gray"}
                  variant="filled"
                >
                  {expiringContracts}
                </Badge>
              </Group>
            </Paper>
          </Stack>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
