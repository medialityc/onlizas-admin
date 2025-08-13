import { GetAllNotificationByUserResponse } from "@/types/notifications";
import { ApiResponse } from "../../../types/fetch/api";

const dataMock: GetAllNotificationByUserResponse = {
  data: [
    {
      id: 1,
      title: "Bienvenido al sistema",
      message:
        "¡Gracias por registrarte en nuestra plataforma! Estamos encantados de tenerte con nosotros.",
      priority: "medium",
      date: new Date("2023-10-15T14:30:00Z"),
      isRead: false,
      notificationType: "individual",
      userNotifications: [],
      channel: ["in_app"],
    },
    {
      id: 2,
      title: "Pago recibido",
      message:
        "Hemos recibido tu pago de $150.00 correspondiente al servicio de envío #12345.",
      priority: "high",
      date: new Date("2023-10-16T09:15:00Z"),
      isRead: true,
      notificationType: "individual",
      userNotifications: [],
      channel: ["in_app"],
    },
    {
      id: 3,
      title: "Envío en camino",
      message:
        "Tu paquete #67890 ha sido recolectado y está en camino a su destino.",
      priority: "low",
      date: new Date("2023-10-17T11:45:00Z"),
      isRead: false,
      notificationType: "massive",
      userNotifications: [],
      channel: ["in_app"],
    },
  ],
  page: 1,
  pageSize: 10,
  totalCount: 1,
  hasNext: false,
  hasPrevious: false,
};
export const mockNotifications: ApiResponse<GetAllNotificationByUserResponse> =
  {
    status: 200,
    error: false,
    data: dataMock,
    detail: "",
    message: "",
    title: "",
  };
