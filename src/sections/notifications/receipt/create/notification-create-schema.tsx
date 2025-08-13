import { z } from "zod";

// Definimos los tipos enumerados para prioridad y canales
const NotificationPriorityEnum = z.enum(["high", "medium", "low"]);
const NotificationChannelEnum = z.enum(["in_app", "email", "sms"]);
const NotificationTypeEnum = z.enum(["individual", "massive"]);
const RecipientTypeEnum = z.array(z.enum(["specific", "role"]));

export const createNotificationSchema = z
  .object({
    title: z
      .string()
      .min(1, "El título es requerido")
      .max(100, "El título no puede exceder 100 caracteres"),

    message: z
      .string()
      .min(1, "El mensaje es requerido")
      .max(2000, "El mensaje no puede exceder 2000 caracteres"),

    priority: NotificationPriorityEnum,

    channels: z
      .array(NotificationChannelEnum)
      .min(1, "Debe seleccionar al menos un canal de envío"),

    recipientType: RecipientTypeEnum,
    notificationType: NotificationTypeEnum,
    specificRecipients: z.array(z.coerce.number().int().positive()).optional(),
    roleRecipients: z.array(z.coerce.number().int().positive()).optional(),
  })
  .refine(
    (data) => {
      const hasSpecific = data.recipientType.includes("specific");
      const hasRole = data.recipientType.includes("role");

      // Si no hay ningún tipo seleccionado
      if (!hasSpecific && !hasRole) return false;

      // Si hay específicos pero no hay destinatarios
      if (
        hasSpecific &&
        (!data.specificRecipients || data.specificRecipients.length === 0)
      )
        return false;

      // Si hay roles pero no hay destinatarios
      if (hasRole && (!data.roleRecipients || data.roleRecipients.length === 0))
        return false;

      return true;
    },
    {
      message:
        "Debe seleccionar al menos un destinatario para cada tipo seleccionado",
      path: ["recipientType"],
    }
  );

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>;
