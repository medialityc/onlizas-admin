"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button/button";
import {
  FormProvider,
  RHFSelect,
  RHFCheckbox,
  RHFSelectWithLabel,
  RHFInputWithLabel,
} from "@/components/react-hook-form";
import {
  NotificationChannel,
  NotificationPriority,
  NotificationType,
} from "@/types/notifications";
import { createNotification } from "@/services/notifications/notification-service";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import showToast from "@/config/toast/toastConfig";
import {
  CreateNotificationSchema,
  createNotificationSchema,
} from "./notification-create-schema";

import { getAllUsers } from "@/services/users";
import { getAllRoles } from "@/services/roles";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/label/label";
import RHFMultiSelect from "@/components/react-hook-form/rhf-autocomplete-multiple-fetcher-scroll-infinity";
import LoaderButton from "@/components/loaders/loader-button";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { Card } from "@/components/cards/card";
interface NotificationCreateFormProps {
  onClose: () => void;
}

export const NotificationCreateForm = ({
  onClose,
}: NotificationCreateFormProps) => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    mode: "onChange" as const,
    reValidateMode: "onChange" as const,
    defaultValues: {
      title: "",
      message: "",
      channels: [],
      recipientType: [],
      roleRecipients: [],
      specificRecipients: [],
    },
  });

  const { watch, setValue } = methods;
  const recipientType = watch("recipientType");

  const onSubmit = async (data: CreateNotificationSchema) => {
    console.log(data);

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      // Campos simples
      formData.append("title", data.title);
      formData.append("message", data.message);
      formData.append("priority", data.priority);
      formData.append("notificationType", data.notificationType);

      // Canales
      data.channels?.forEach((channel) => {
        formData.append("channels", channel);
      });

      // Tipos de destinatarios
      data.recipientType?.forEach((type) => {
        formData.append("recipientType", type);
      });

      // Usuarios específicos
      data.specificRecipients?.forEach((id) => {
        formData.append("specificRecipients", id.toString());
      });

      // Roles
      data.roleRecipients?.forEach((id) => {
        formData.append("roleRecipients", id.toString());
      });
      const response = await createNotification(formData);
      if (!response.error) {
        showToast("Notificación creada y enviada exitosamente", "success");
        // Reset form
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
        <div>
          <RHFSelect
            label="Tipo de notificación"
            name="notificationType"
            options={typeOptions}
            required
          />
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
          <div className="gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prioridad *
            </label>
            <RHFSelect
              name="priority"
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

          {/* Canales de envío */}
          <div className="flex ">
            <div className="gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Canales Envío *
              </label>
              <RHFSelectWithLabel
                name="channels"
                placeholder="Selecciona canales"
                /*  objectValueKey="label" */
                options={channelOptions}
                size="small"
                multiple
                required
              />
            </div>
          </div>
        </div>

        {/* Destinatarios */}
        <div>
          <label className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            Destinatarios
          </label>
          <div className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...methods.register("recipientType")}
                  value="specific"
                  className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuarios específicos
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...methods.register("recipientType")}
                  value="role"
                  className="mr-2 h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Por rol
                </span>
              </label>
            </div>
            {methods.formState.errors.recipientType && (
              <p className="text-red-500 text-sm mt-2">
                {methods.formState.errors.recipientType.message}
              </p>
            )}

            {recipientType?.includes("specific") && (
              <div>
                <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Seleccionar Usuarios
                </label>
                <RHFAutocompleteFetcherInfinity
                  name="specificRecipients"
                  placeholder="Selecciona usuarios"
                  /* label="Seleccionar usuarios" */
                  multiple
                  required
                  onFetch={
                    () => getAllUsers({}) // tu API debe aceptar page y pageSize
                  }
                  objectKeyLabel="name"
                  objectValueKey="id"
                  params={{ pageSize: 10 }}
                  queryKey="user_cache"
                  /* renderOption={(b) => b.name}
                  renderMultiplesValues={(b, removeSelected) => (
                    <div className="mt-3 gap-3 flex flex-col">
                      {b.map((b) => (
                        <Card key={b.id}>{b.name}</Card>
                      ))}
                    </div>
                  )} */
                />
                {methods.formState.errors.specificRecipients && (
                  <p className="text-red-500 text-sm mt-2">
                    {methods.formState.errors.specificRecipients.message}
                  </p>
                )}
              </div>
            )}

            {recipientType?.includes("role") && (
              <div>
                <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Seleccionar Roles
                </label>
                <RHFAutocompleteFetcherInfinity
                  name="roleRecipients"
                  /* label="Seleccionar roles" */
                  placeholder="Buscar roles..."
                  required
                  params={{ pageSize: 10 }} // batch de 25
                  onFetch={getAllRoles}
                  multiple
                />
                {methods.formState.errors.specificRecipients && (
                  <p className="text-red-500 text-sm mt-2">
                    {methods.formState.errors.specificRecipients.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div className="mt-8">
          <LoaderButton
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar notificación"}
          </LoaderButton>
        </div>
      </div>
    </FormProvider>
  );
};
