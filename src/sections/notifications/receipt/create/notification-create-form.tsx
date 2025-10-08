"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormProvider,
  RHFSelect,
  RHFInputWithLabel,
  RHFCheckbox,
} from "@/components/react-hook-form";
import { NotificationChannel, NotificationType } from "@/types/notifications";
import { createNotification } from "@/services/notifications/notification-service";
import { useState } from "react";
import showToast from "@/config/toast/toastConfig";
import {
  CreateNotificationSchema,
  createNotificationSchema,
} from "./notification-create-schema";

import { getAllUsers } from "@/services/users";
import { getAllRoles } from "@/services/roles";
import { Label } from "@/components/label/label";

import LoaderButton from "@/components/loaders/loader-button";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";

import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";
interface NotificationCreateFormProps {
  onClose: () => void;
}

export const NotificationCreateForm = ({
  onClose,
}: NotificationCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    mode: "onChange" as const,
    reValidateMode: "onChange" as const,
    defaultValues: {
      title: "",
      message: "",
      channels: [],
      roleType: false,
      specificType: false,
      roleRecipients: [],
      specificRecipients: [],
    },
  });

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.UPDATE]);

  const { watch } = methods;

  const onSubmit = async (data: CreateNotificationSchema) => {
    console.log(data);
    const {
      channels,
      message,
      notificationType,
      priority,
      title,
      roleRecipients,
      specificRecipients,
    } = data;
    setIsSubmitting(true);
    try {
      const response = await createNotification({
        channels,
        message,
        notificationType,
        priority,
        title,
        roleRecipients,
        specificRecipients,
      } as CreateNotificationSchema);
      if (!response.error) {
        showToast("Notificación creada y enviada exitosamente", "success");
        onClose();
        methods.reset();
      } else {
        showToast(response.message || "Error al crear notificación", "error");
      }
    } catch (error) {
      console.error("Error al crear notificación:", error);
      showToast("Error al crear notificación", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const channelOptions: { value: NotificationChannel; label: string }[] = [
    { value: "in_app", label: "En la aplicación" },
    { value: "email", label: "Correo electrónico" },
    { value: "sms", label: "SMS" },
  ];
  const typeOptions: { value: NotificationType; label: string }[] = [
    { value: "individual", label: "Individual" },
    { value: "massive", label: "Masivo" },
  ];

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Tipo de notificación */}
        <div className="flex justify-between mt-2">
          <div className="w-1/2 mr-2">
            <RHFSelect
              label="Tipo de notificación"
              name="notificationType"
              options={typeOptions}
              required
              size="small"
            />
          </div>

          <div className="w-1/2 ml-2">
            <RHFSelect
              name="priority"
              label="Prioridad"
              required
              placeholder="Selecciona prioridad"
              options={[
                { value: "low", label: "Baja" },
                { value: "medium", label: "Media" },
                { value: "high", label: "Alta" },
              ]}
              size="small"
              /* objectValueKey="label" */
              multiple={false}
            />
          </div>
        </div>

        {/* Título y mensaje */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <RHFInputWithLabel
              name="title"
              label="Título"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Asunto de la notificación"
              required
            />
          </div>

          <div>
            <RHFInputWithLabel
              label="Mensaje"
              name="message"
              type="textarea"
              className="w-full px-3 py-2 border rounded-md min-h-[150px]"
              placeholder="Contenido de la notificación"
              required
            />
          </div>
        </div>

        {/* Prioridad */}
        <div className="flex justify-between">
          {/* Canales de envío */}
          <div className="w-full ">
            <RHFSelect
              options={channelOptions}
              name="channels"
              placeholder="Selecciona canales"
              label="Canales Envío"
              /*  options={channelOptions} */
              multiple
              required
            />
            {/* <RHFSelect
                options={channelOptions}
                name="channels"
                bodyClassname="min-h-[30px] p-1 h-4"
                placeholder="Selecciona canales"
                label="Canales Envío"
                /*  options={channelOptions} 
                size="small"
                multiple
                required
              /> */}
          </div>
        </div>

        {/* Destinatarios */}
        <div>
          <Label className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            Destinatarios
          </Label>
          <div className="space-y-4">
            <div className="flex gap-4">
              <RHFCheckbox label="Usuarios específicos" name="specificType" />
              <RHFCheckbox label="Por rol" name="roleType" />
            </div>
            {methods.formState.errors.specificType && (
              <p className="text-red-500 text-sm mt-2">
                {methods.formState.errors.specificType.message}
              </p>
            )}

            {watch("specificType") && (
              <div>
                <RHFAutocompleteFetcherInfinity
                  name="specificRecipients"
                  placeholder="Selecciona usuarios"
                  label="Seleccionar usuarios"
                  multiple
                  required
                  onFetch={getAllUsers}
                />
                {/* {methods.formState.errors.specificRecipients && (
                  <p className="text-red-500 text-sm mt-2">
                    {methods.formState.errors.specificRecipients.message}
                  </p>
                )} */}
              </div>
            )}

            {watch("roleType") && (
              <div>
                <RHFAutocompleteFetcherInfinity
                  name="roleRecipients"
                  label="Seleccionar roles"
                  placeholder="Buscar roles..."
                  required
                  params={{ pageSize: 10 }} // batch de 25
                  onFetch={getAllRoles}
                  multiple
                />
                {/* {methods.formState.errors.specificRecipients && (
                  <p className="text-red-500 text-sm mt-2">
                    {methods.formState.errors.specificRecipients.message}
                  </p>
                )} */}
              </div>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="mt-8">
          {hasUpdatePermission && (
            <LoaderButton
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar notificación"}
            </LoaderButton>
          )}
        </div>
      </div>
    </FormProvider>
  );
};
