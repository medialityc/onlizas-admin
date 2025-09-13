import { gateways } from "@/app/payment/data/mock-datas";
import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { CreditCard, Edit, Eye, EyeOff, Trash2 } from "lucide-react";

export const GatewayCard = ({
  gateway,
  showCredentials,
  toggleCredentialVisibility,
}: {
  gateway: (typeof gateways)[number];
  showCredentials: boolean;
  toggleCredentialVisibility: () => void;
}) => {
  return (
    <Card
      padding="md"
      radius="md"
      shadow="xs"
      withBorder
      className="bg-gray-50 dark:bg-gray-800"
    >
      <Group align="center">
        <Group>
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

        <Group gap="xs">
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
          >
            {showCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button variant="subtle" size="xs">
            <Edit size={14} />
          </Button>
          <Button variant="subtle" size="xs" color="red">
            <Trash2 size={14} />
          </Button>
        </Group>
      </Group>

      {showCredentials && (
        <Card
          padding="sm"
          radius="sm"
          mt="sm"
          className="bg-gray-100 dark:bg-gray-700"
        >
          <Text fw={500} mb="xs" className="text-gray-900 dark:text-gray-100">
            Credentials
          </Text>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Text c="dimmed" className="dark:text-gray-400">
                API Key:
              </Text>
              <Text className="font-mono text-gray-900 dark:text-gray-100">
                sk_test_***************
              </Text>
            </div>
            <div>
              <Text c="dimmed" className="dark:text-gray-400">
                Webhook Secret:
              </Text>
              <Text className="font-mono text-gray-900 dark:text-gray-100">
                whsec_***************
              </Text>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};
