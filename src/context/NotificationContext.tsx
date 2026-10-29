import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";

export interface NotificacionBackend {
  id: number;
  tipo: "producto" | "favorito" | "oferta";
  titulo: string;
  descripcion: string;
  tiempo?: string;
  created_at?: string;
  leida: boolean;
}

interface NotificationContextType {
  notifications: NotificacionBackend[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificacionBackend[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isLoggedIn } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("repilche-token");
      const res = await fetch(`${apiUrl}/notifications/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        const lista: NotificacionBackend[] = Array.isArray(data) ? data : data.results || [];
        setNotifications(lista);
      }
    } catch (err) {
      console.warn("Error al cargar notificaciones:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, isLoggedIn]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    setNotifications((actuales) =>
      actuales.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );

    try {
      const token = localStorage.getItem("repilche-token");
      await fetch(`${apiUrl}/notifications/${id}/read/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn(`Error al marcar notificación ${id} como leída:`, err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((actuales) =>
      actuales.map((n) => ({ ...n, leida: true }))
    );

    try {
      const token = localStorage.getItem("repilche-token");
      await fetch(`${apiUrl}/notifications/read-all/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn("Error al marcar todas las notificaciones como leídas:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext debe usarse dentro de NotificationProvider"
    );
  }

  return context;
};