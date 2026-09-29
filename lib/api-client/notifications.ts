import { apiRequest } from "./core";

export interface NotificationItemResponse {
  id: string;
  type: string;
  title: string;
  body: string;
  link?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface BroadcastNotificationInput {
  title: string;
  body: string;
  target?: "all" | "students" | "faculty";
  type?: string;
  link?: string;
}

export interface BroadcastNotificationResponse {
  success: boolean;
  recipientsCount: number;
  title: string;
  body: string;
  target: string;
}

export const notificationsApi = {
  getPublic: () =>
    apiRequest<NotificationItemResponse[]>("/notifications/public"),
  getAll: () =>
    apiRequest<NotificationItemResponse[]>("/notifications/public").catch(() =>
      apiRequest<NotificationItemResponse[]>("/notifications")
    ),
  getMy: () =>
    apiRequest<NotificationItemResponse[]>("/notifications/my"),
  createBroadcast: (body: BroadcastNotificationInput) =>
    apiRequest<BroadcastNotificationResponse>("/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  markAsRead: (id: string) =>
    apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllAsRead: () =>
    apiRequest("/notifications/read-all", { method: "PATCH" }),
};
