"use client";

import { Paper, Text, SimpleGrid, Group, ThemeIcon, Stack, Badge, ActionIcon, Divider } from "@mantine/core";
import { TagIcon, UsersIcon, DocumentTextIcon, ClockIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { TagIcon as TagIconSolid, UsersIcon as UsersIconSolid, DocumentTextIcon as DocumentTextIconSolid, ClockIcon as ClockIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useImporterData } from "@/contexts/importer-data-context";

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      styles={{
        root: {
          backgroundColor: "light-dark(#ffffff, #1b2e4b)",
          borderColor: "light-dark(#e5e7eb, #253a54)",
        },
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="gray" mb={4} className="text-gray-400 dark:text-gray-400">
            {title}
          </Text>
          <Text size="xl" fw={700} className="text-gray-900 dark:text-white">
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}
        </div>
        <ThemeIcon
          size={48}
          radius="md"
          variant="light"
          color={color}
        >
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

function QuickAction({ label, icon, href, badge }: QuickActionProps) {
  return (
    <Link href={href}>
      <Paper
        p="sm"
        radius="md"
        withBorder
        className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        styles={{
          root: {
            backgroundColor: "light-dark(#ffffff, #1b2e4b)",
            borderColor: "light-dark(#e5e7eb, #253a54)",
          },
        }}
      >
        <Group justify="space-between">
          <Group gap="sm">
            <ThemeIcon size={32} radius="md" variant="light" color="blue">
              {icon}
            </ThemeIcon>
            <Text size="sm" fw={500} className="text-gray-900 dark:text-white">
              {label}
            </Text>
          </Group>
          <Group gap="xs">
            {badge !== undefined && badge > 0 && (
              <Badge size="sm" color="yellow" variant="filled">
                {badge}
              </Badge>
            )}
            <ArrowRightIcon className="h-4 w-4 text-gray-400" />
          </Group>
        </Group>
      </Paper>
    </Link>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
}

function ActivityItem({ title, description, time, status }: ActivityItemProps) {
  const statusColors = {
    success: "green",
    warning: "yellow",
    error: "red",
    info: "gray",
  };

  return (
    <Group justify="space-between" align="flex-start" py="xs">
      <Group gap="sm" align="flex-start">
        <div
          className={`w-2 h-2 rounded-full mt-2 ${
            status === "success"
              ? "bg-green-500"
              : status === "warning"
                ? "bg-yellow-500"
                : status === "error"
                  ? "bg-red-500"
                  : "bg-gray-400"
          }`}
        />
        <div>
          <Text size="sm" fw={500} className="text-gray-900 dark:text-white">
            {title}
          </Text>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </div>
      </Group>
      <Text size="xs" c="dimmed">
        {time}
      </Text>
    </Group>
  );
}

interface Props {
  importerId: string;
}

export default function ImporterDashboardView({ importerId }: Props) {
  const { importerData } = useImporterData();
  
  const activeNomenclators = importerData?.nomenclators?.filter((n) => n.isActive).length || 0;
  const totalNomenclators = importerData?.nomenclators?.length || 0;
  const activeContracts = importerData?.contracts?.filter((c) => {
    const status = c.status?.toUpperCase();
    return status === "APPROVED" || status === "ACTIVE";
  }).length || 0;
  const pendingContracts = importerData?.contracts?.filter((c) => {
    const status = c.status?.toUpperCase();
    return status === "PENDING";
  }).length || 0;
  const expiringContracts = importerData?.contracts?.filter((c) => {
    if (!c.endDate) return false;
    const endDate = new Date(c.endDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length || 0;

  return (
    <div>
      <div className="mb-6">
        <Text size="xl" fw={700} className="text-gray-900 dark:text-white">
          Dashboard
        </Text>
        <Text size="sm" c="dimmed">
          Resumen de tu actividad como importadora
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <StatCard
          title="Nomencladores Activos"
          value={activeNomenclators}
          subtitle={totalNomenclators > activeNomenclators ? `+${totalNomenclators - activeNomenclators} inactivos` : undefined}
          icon={<TagIconSolid className="h-6 w-6" />}
          color="teal"
        />
        <StatCard
          title="Proveedores Contratados"
          value={activeContracts}
          subtitle="+1 este mes"
          icon={<UsersIconSolid className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={pendingContracts}
          subtitle="Requieren revisión"
          icon={<DocumentTextIconSolid className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Contratos por Vencer"
          value={expiringContracts}
          subtitle="Próximos 30 días"
          icon={<ClockIconSolid className="h-6 w-6" />}
          color="red"
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Paper
          p="lg"
          radius="md"
          withBorder
          styles={{
            root: {
              backgroundColor: "light-dark(#ffffff, #1b2e4b)",
              borderColor: "light-dark(#e5e7eb, #253a54)",
            },
          }}
        >
          <Text size="lg" fw={600} mb={4} className="text-gray-900 dark:text-white">
            Acciones Rápidas
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Accede a las funciones principales
          </Text>

          <Stack gap="sm">
            <QuickAction
              label="Gestionar Nomencladores"
              icon={<TagIcon className="h-4 w-4" />}
              href={`/importadora/${importerId}/nomencladores`}
            />
            <QuickAction
              label="Ver Proveedores"
              icon={<UsersIcon className="h-4 w-4" />}
              href={`/importadora/${importerId}/proveedores`}
            />
            <QuickAction
              label="Revisar Solicitudes"
              icon={<DocumentTextIcon className="h-4 w-4" />}
              href={`/importadora/${importerId}/solicitudes`}
              badge={pendingContracts}
            />
          </Stack>
        </Paper>

        <Paper
          p="lg"
          radius="md"
          withBorder
          styles={{
            root: {
              backgroundColor: "light-dark(#ffffff, #1b2e4b)",
              borderColor: "light-dark(#e5e7eb, #253a54)",
            },
          }}
        >
          <Text size="lg" fw={600} mb={4} className="text-gray-900 dark:text-white">
            Actividad Reciente
          </Text>
          <Text size="sm" c="dimmed" mb="md">
            Últimas acciones en tu cuenta
          </Text>

          <Stack gap={0}>
            <ActivityItem
              title="Nueva solicitud de contrato"
              description="Proveedor ABC"
              time="Hace 2 horas"
              status="warning"
            />
            <Divider />
            <ActivityItem
              title="Contrato aprobado"
              description="Distribuidora XYZ"
              time="Hace 5 horas"
              status="success"
            />
            <Divider />
            <ActivityItem
              title="Nomenclador actualizado"
              description="Electrónica"
              time="Ayer"
              status="info"
            />
            <Divider />
            <ActivityItem
              title="Solicitud rechazada"
              description="Importadora Norte"
              time="Hace 2 días"
              status="error"
            />
          </Stack>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
