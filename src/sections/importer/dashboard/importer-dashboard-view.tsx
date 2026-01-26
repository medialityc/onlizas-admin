"use client";

import { Paper, Text, SimpleGrid, Group, ThemeIcon, Progress, Stack, Badge, RingProgress, Center, LoadingOverlay } from "@mantine/core";
import { TagIcon as TagIconSolid, UsersIcon as UsersIconSolid, DocumentTextIcon as DocumentTextIconSolid, ClockIcon as ClockIconSolid, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { getImporterDashboard, type DashboardStats } from "@/services/importer-portal";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const response = await getImporterDashboard();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          toast.error(response.message || "No se pudieron cargar las estadísticas");
        }
      } catch (error) {
        toast.error("Error al cargar el dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const activeNomenclators = stats?.nomenclators.active || 0;
  const totalNomenclators = stats?.nomenclators.total || 0;
  const inactiveNomenclators = stats?.nomenclators.inactive || 0;
  
  const activeContracts = stats?.contracts.active || 0;
  const pendingContracts = stats?.contracts.pending || 0;
  const rejectedContracts = stats?.contracts.rejected || 0;
  const expiringContracts = stats?.contracts.expiringIn30Days || 0;
  const totalContracts = stats?.contracts.total || 0;

  const nomenclatorProgress = stats?.statistics.nomenclatorActiveRate || 0;
  const contractApprovalRate = stats?.statistics.contractApprovalRate || 0;

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      <LoadingOverlay visible={loading} />
      
      <div className="mb-4">
        <Text size="28px" fw={700} className="text-gray-900 dark:text-white">
          Dashboard
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
        />
        <StatCard
          title="Contratos Activos"
          value={activeContracts}
          subtitle={`${totalContracts} contratos totales`}
          icon={<UsersIconSolid className="h-7 w-7" />}
          color="blue"
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
