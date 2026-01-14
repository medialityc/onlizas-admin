import type { Gateway } from "@/types/gateway.interface";
import { Badge, Button, Card, Group, Text, Modal } from "@mantine/core";
import { CreditCard, Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import {
  deleteGateway,
  getGatewayById,
  updateGateway,
  setGatewayAsDefault,
} from "@/services/gateways";
import showToast from "@/config/toast/toastConfig";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import FormProvider from "@/components/react-hook-form/form-provider";
import SimpleModal from "@/components/modal/modal";
import ConfirmationDialog from "@/components/modal/confirm-modal";
import { RHFInputWithLabel, RHFSwitch } from "@/components/react-hook-form";


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

  // Estados para el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState<Gateway | null>(null);

  // Hook del formulario - siempre se llama en el nivel superior
  const methods = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      isDefault: false,
      isEnabled: false,
    },
  });

  // Resetear el formulario cuando se abre el modal con datos del gateway
  useEffect(() => {
    if (editingGateway && editModalOpen) {
      methods.reset({
        name: editingGateway.name,
        code: editingGateway.code,
        description: editingGateway.description,
        isDefault: editingGateway.isDefault,
        isEnabled: editingGateway.isEnabled,
      });
    }
  }, [editingGateway, editModalOpen, methods]);

  // Estado para el modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const hasReadPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasDeletePermission = hasPermission([PERMISSION_ENUM.DELETE]);

  // Función para abrir el modal de edición
  const handleEditGateway = () => {
    if (!hasUpdatePermission) return;

    // Usar los datos del gateway que ya tenemos, no necesitamos hacer una llamada adicional
    setEditingGateway(gateway);
    setEditModalOpen(true);
  };

  // Función para guardar los cambios de edición
  const handleUpdateGateway = async (data: any) => {
    if (!editingGateway) return;

    try {
      // Si se está marcando como predeterminada, usar el endpoint específico
      if (data.isDefault && !editingGateway.isDefault) {
        const defaultResponse = await setGatewayAsDefault(editingGateway.id);
        if (defaultResponse.error) {
          showToast("Error al establecer como predeterminada", "error");
          return;
        }
      }

      // Combinar los datos del formulario con el gateway existente
      const updatedGateway = { ...editingGateway, ...data };
      const response = await updateGateway(editingGateway.id, updatedGateway);

      if (response.error) {
        showToast("Error al actualizar la pasarela", "error");
        return;
      }

      showToast("Pasarela actualizada exitosamente", "success");
      handleCloseEditModal();

      // Refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
    } catch (error) {
      showToast("Error al actualizar la pasarela", "error");
    }
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingGateway(null);
  };
  const handleDeleteGateway = () => {
    if (!hasDeletePermission) return;
    setDeleteModalOpen(true);
  };

  // Función que se ejecuta cuando se confirma la eliminación
  const confirmDeleteGateway = async () => {
    setLoadingDelete(true);
    try {
      const response = await deleteGateway(gateway.id);
      
      // Verificar si la respuesta es exitosa
      if (response.error !== true) {
        showToast("Pasarela eliminada exitosamente", "success");
        queryClient.invalidateQueries({ queryKey: ["gateways"] });
        setDeleteModalOpen(false);
        return;
      }
      
      // Si hay error, mostrar el mensaje
      const errorMessage = (response as any)?.message || "Error al eliminar la pasarela";
      showToast(errorMessage, "error");
    } catch (error) {
      showToast("Error al eliminar la pasarela", "error");
    } finally {
      setLoadingDelete(false);
      setDeleteModalOpen(false);
    }
  };

  // Estilos para el Card con soporte de modo oscuro
  const cardStyles = {
    root: {
      backgroundColor: "var(--gateway-card-bg)",
      borderColor: "var(--gateway-card-border)",
    },
  };

  return (
    <div className="[--gateway-card-bg:theme(colors.gray.50)] dark:[--gateway-card-bg:theme(colors.gray.800)] [--gateway-card-border:theme(colors.gray.300)] dark:[--gateway-card-border:theme(colors.gray.700)]">
      <Card
        padding="md"
        radius="md"
        shadow="xs"
        withBorder
        styles={cardStyles}
      >
        <Group align="center" className="flex-col sm:flex-row gap-4 sm:gap-2">
          <Group className="w-full sm:w-auto">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <div>
              <Text fw={500} className="text-gray-900 dark:!text-white">
                {gateway.name}
              </Text>
              <Text size="sm" c="dimmed" className="dark:!text-gray-400">
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
            {/* <Button
            variant="subtle"
            size="xs"
            onClick={toggleCredentialVisibility}
            disabled={!hasReadPermission}
          >
            {showCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button> */}
            {hasUpdatePermission && (
              <Button variant="subtle" size="xs" onClick={handleEditGateway}>
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

        {/* {showCredentials && hasReadPermission && (
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
      )} */}
      </Card>

      <SimpleModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        title={`Editar ${editingGateway?.name || gateway.name}`}
      >
        <FormProvider methods={methods} onSubmit={handleUpdateGateway}>
          <div className="space-y-6">
            {/* Información básica editable */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Información de la Pasarela
              </h3>
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                type="text"
                placeholder="Ingresa el nombre de la pasarela"
              />
              <RHFInputWithLabel
                name="code"
                label="Código"
                type="text"
                placeholder="Ingresa el código de la pasarela"
              />
              <RHFInputWithLabel
                name="description"
                label="Descripción"
                type="textarea"
                rows={3}
                placeholder="Ingresa la descripción de la pasarela"
              />
            </div>

            {/* Configuración editable */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Configuración
              </h3>
              <RHFSwitch name="isEnabled" label="Habilitado" />
              <RHFSwitch name="isDefault" label="Predeterminado" />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="subtle" onClick={handleCloseEditModal}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </FormProvider>
      </SimpleModal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmationDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteGateway}
        title={`¿Eliminar ${gateway.name}?`}
        description={`¿Estás seguro de que quieres eliminar la pasarela "${gateway.name}"? Esta acción no se puede deshacer.`}
        actionType="delete"
        loading={loadingDelete}
      />
    </div>
  );
};
