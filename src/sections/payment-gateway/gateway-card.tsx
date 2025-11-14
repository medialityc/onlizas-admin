import type { Gateway } from "@/types/gateway.interface";
import { Badge, Button, Card, Group, Text } from "@mantine/core";
import { CreditCard, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { deleteGateway } from "@/services/gateways";
import showToast from "@/config/toast/toastConfig";
import { useQueryClient } from "@tanstack/react-query";

export const GatewayCard = ({
  gateway,
  showCredentials,
  toggleCredentialVisibility,
}: {
  gateway: Gateway;
  showCredentials: boolean;
  toggleCredentialVisibility: () => void;
}) => {
  // Control de permisos
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();

  const hasReadPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasDeletePermission = hasPermission([PERMISSION_ENUM.DELETE]);

  //Funcion para eliminar pasarela por id que llame al endpoint deleteGateway
  const handleDeleteGateway = async () => {
    if (!hasDeletePermission) return;
    try {
      const response = await deleteGateway(gateway.id);
      console.log(response);
      if (!response.error) {
        showToast("Pasarela eliminada exitosamente", "success");
        queryClient.invalidateQueries({ queryKey: ["gateways"] });
        return;
      } else {
        showToast("Error al eliminar la pasarela", "error");
        queryClient.invalidateQueries({ queryKey: ["gateways"] });
      }
    } catch (error) {
      showToast(`Error al eliminar la pasarela: ${error}`, "error");
    }
  };

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
              Código: {gateway.code}
            </Text>
          </div>
        </Group>

        <Group
          gap="xs"
          className="w-full sm:w-auto justify-center sm:justify-end flex-wrap"
        >
          <Badge color={gateway.isEnabled ? "green" : "red"} variant="filled">
            {gateway.isEnabled ? "Habilitado" : "Deshabilitado"}
          </Badge>
          {gateway.isDefault && (
            <Badge color="blue" variant="filled">
              Predeterminado
            </Badge>
          )}
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
            <Button
              variant="subtle"
              size="xs"
              color="red"
              onClick={handleDeleteGateway}
            >
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
            Credenciales
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Text c="dimmed" className="dark:text-gray-400">
                Clave API:
              </Text>
              <Text className="font-mono text-gray-900 dark:text-gray-100 break-all">
                {gateway.key
                  ? `${gateway.key.substring(0, 8)}********`
                  : "No configurada"}
              </Text>
            </div>
          </div>
        </Card>
      )}
    </Card>
  );
};
