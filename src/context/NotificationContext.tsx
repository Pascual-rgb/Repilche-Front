import { createContext, useContext, useState } from "react";

interface NotificationContextType {
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext =
  createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unreadNotifications, setUnreadNotifications] = useState<number[]>([
    1,
    2,
  ]);

  const markAsRead = (id: number) => {
    setUnreadNotifications((actuales) =>
      actuales.filter((notificationId) => notificationId !== id)
    );
  };

  const markAllAsRead = () => {
    setUnreadNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadCount: unreadNotifications.length,
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