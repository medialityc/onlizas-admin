import type { gateways } from "@/services/data-for-gateway-settings/mock-datas";
import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { CreditCard, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

export const GatewayCard = ({
  gateway,
  showCredentials,
  toggleCredentialVisibility,
}: {
  gateway: (typeof gateways)[number];
  showCredentials: boolean;
  toggleCredentialVisibility: () => void;
}) => {
  // Control de permisos
  const { hasPermission } = usePermissions();

  const hasReadPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasDeletePermission = hasPermission([PERMISSION_ENUM.DELETE]);

  return (
    <Card
      padding="md"
      radius="md"
      shadow="xs"
      withBorder
      className="bg-gray-50 dark:bg-gray-800"
    >
      <Group align="center" className="flex-col sm:flex-row gap-4 sm:gap-2">
        <Group className="w-full sm:w-auto">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
            <CreditCard size={18} />
          </div>
          <div>
            <Text fw={500} className="text-gray-900 dark:text-gray-100">
              {gateway.name}
            </Text>
            <Text size="sm" c="dimmed" className="dark:text-gray-400">
              Created: {gateway.created}
            </Text>
          </div>
        </Group>

        <Group
          gap="xs"
          className="w-full sm:w-auto justify-center sm:justify-end flex-wrap"
        >
          <Badge
            color={gateway.status === "active" ? "green" : "red"}
            variant="filled"
          >
            {gateway.status}
          </Badge>
          <Button
            variant="subtle"
            size="xs"
            onClick={toggleCredentialVisibility}
            disabled={!hasReadPermission}
          >
            {showCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          {hasUpdatePermission && (
            <Button variant="subtle" size="xs">
              <Edit size={14} />
            </Button>
          )}
          {hasDeletePermission && (
            <Button variant="subtle" size="xs" color="red">
              <Trash2 size={14} />
            </Button>
          )}
        </Group>
      </Group>

      {showCredentials && hasReadPermission && (
        <Card
          padding="sm"
          radius="sm"
          mt="sm"
          className="bg-gray-100 dark:bg-gray-700"
        >
          <Text fw={500} mb="xs" className="text-gray-900 dark:text-gray-100">
            Credentials
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Text c="dimmed" className="dark:text-gray-400">
                API Key:
              </Text>
              <Text className="font-mono text-gray-900 dark:text-gray-100 break-all">
                sk_test_***************
              </Text>
            </div>
            <div>
              <Text c="dimmed" className="dark:text-gray-400">
                Webhook Secret:
              </Text>
              <Text className="font-mono text-gray-900 dark:text-gray-100 break-all">
                whsec_***************
              </Text>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};
