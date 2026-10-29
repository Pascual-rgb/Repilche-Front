import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";

export interface NotificacionBackend {
  id: number;
  tipo?: "producto" | "favorito" | "oferta" | string;
  titulo: string;
  descripcion: string;
  tiempo?: string;
  created_at?: string;
  leida: boolean;
  leido?: boolean;
}

export type Notificacion = NotificacionBackend;

interface NotificationContextType {
  notifications: Notificacion[];
  notificaciones: Notificacion[];
  unreadCount: number;
  noLeidas: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchNotificaciones: () => Promise<void>;
  recargarNotificaciones: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  marcarComoLeida: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  marcarTodasComoLeidas: () => Promise<void>;
}

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // Estado inicial limpio sin mocks
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isLoggedIn } = useAuthContext();

  const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setNotificaciones([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("repilche-token");
      
      // 1. Intenta consultar el endpoint real /api/notificaciones/
      let res = await fetch(`${apiUrl}/notificaciones/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      // Fallback si la ruta en el backend está en inglés /api/notifications/
      if (res.status === 404) {
        res = await fetch(`${apiUrl}/notifications/`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      }

      if (res.ok) {
        const data = await res.json();
        // Mapea correctamente si viene paginada (results) o array plano
        const listaRaw: any[] = Array.isArray(data) ? data : data.results || [];
        
        const listaNormalizada: Notificacion[] = listaRaw.map((item) => {
          const esLeida = Boolean(
            item.leida !== undefined
              ? item.leida
              : item.leido !== undefined
              ? item.leido
              : false
          );

          return {
            id: item.id,
            tipo: item.tipo || "producto",
            titulo: item.titulo || item.title || "Notificación",
            descripcion: item.descripcion || item.mensaje || item.message || "",
            tiempo: item.tiempo,
            created_at: item.created_at || item.fecha_creacion || item.fecha,
            leida: esLeida,
            leido: esLeida,
          };
        });

        setNotificaciones(listaNormalizada);
      }
    } catch (err) {
      console.warn("Error al cargar notificaciones:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, isLoggedIn]);

  useEffect(() => {
    fetchNotifications();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isLoggedIn) {
        fetchNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications, isLoggedIn]);

  const markAsRead = async (id: number) => {
    // Actualización optimista del estado local en React
    setNotificaciones((actuales) =>
      actuales.map((n) => (n.id === id ? { ...n, leida: true, leido: true } : n))
    );

    try {
      const token = localStorage.getItem("repilche-token");
      if (!token) return;

      // PATCH a la API real
      let res = await fetch(`${apiUrl}/notificaciones/${id}/leer/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Fallback a POST si el backend no admite PATCH
      if (res.status === 405) {
        res = await fetch(`${apiUrl}/notificaciones/${id}/leer/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (res.status === 404) {
        await fetch(`${apiUrl}/notifications/${id}/read/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.warn(`Error al marcar notificación ${id} como leída:`, err);
    }
  };

  const markAllAsRead = async () => {
    // Actualización optimista del estado local en React
    setNotificaciones((actuales) =>
      actuales.map((n) => ({ ...n, leida: true, leido: true }))
    );

    try {
      const token = localStorage.getItem("repilche-token");
      if (!token) return;

      let res = await fetch(`${apiUrl}/notificaciones/leer-todas/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        res = await fetch(`${apiUrl}/notificaciones/leer-todas/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (!res.ok) {
        await fetch(`${apiUrl}/notifications/read-all/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.warn("Error al marcar todas las notificaciones como leídas:", err);
    }
  };

  // Contador de no leídas dinámico según especificación
  const noLeidas = notificaciones.filter((n) => !n.leida && !n.leido).length;
  const unreadCount = noLeidas;

  return (
    <NotificationContext.Provider
      value={{
        notifications: notificaciones,
        notificaciones,
        unreadCount,
        noLeidas,
        loading,
        fetchNotifications,
        fetchNotificaciones: fetchNotifications,
        recargarNotificaciones: fetchNotifications,
        markAsRead,
        marcarComoLeida: markAsRead,
        markAllAsRead,
        marcarTodasComoLeidas: markAllAsRead,
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