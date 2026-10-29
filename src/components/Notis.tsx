import "./styles/Notis.css";

import {
  FaBell,
  FaHeart,
  FaShoppingBag,
  FaTag,
} from "react-icons/fa";

import { useNotificationContext, type NotificacionBackend } from "../context/NotificationContext";

const Notis = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  } = useNotificationContext();

  const obtenerIcono = (tipo: NotificacionBackend["tipo"]) => {
    switch (tipo) {
      case "producto":
        return <FaShoppingBag />;
      case "favorito":
        return <FaHeart />;
      case "oferta":
        return <FaTag />;
      default:
        return <FaBell />;
    }
  };

  return (
    <main className="notis-page">
      <section className="notis-container">

        <div className="notis-header">
          <div>
            <h1>Notificaciones</h1>

            <p>
              Mantenete al día con las novedades de Repilche.
            </p>
          </div>

          <FaBell className="notis-main-icon" />
        </div>

        <div className="notis-actions">
          <span>
            {unreadCount === 0
              ? "No tenés notificaciones nuevas"
              : `Tenés ${unreadCount} notificación${
                  unreadCount > 1 ? "es" : ""
                } nueva${unreadCount > 1 ? "s" : ""}`}
          </span>

          {unreadCount > 0 && (
            <button onClick={markAllAsRead}>
              Marcar todas como leídas
            </button>
          )}
        </div>

        <div className="notis-list">
            {loading && notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>Cargando notificaciones...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No tenés notificaciones en este momento.</p>
            </div>
          ) : (
          notifications.map((notificacion) => (
            <div
              key={notificacion.id}
              className={`notis-card ${
                !notificacion.leida ? "unread" : ""
              }`}
              onClick={() => {
                if (!notificacion.leida) {
                  markAsRead(notificacion.id);
                }
              }}
            >

              <div
                className={`notis-icon ${
                  notificacion.tipo === "producto"
                    ? "product-icon"
                    : notificacion.tipo === "favorito"
                    ? "heart-icon"
                    : "tag-icon"
                }`}
              >
                {obtenerIcono(notificacion.tipo)}
              </div>

              <div className="notis-content">

                <h3>{notificacion.titulo}</h3>

                <p>{notificacion.descripcion}</p>

                <span>
                  {notificacion.tiempo ||
                  (notificacion.created_at
                        ? new Date(notificacion.created_at).toLocaleDateString()
                        : "Hace momentos")}
                </span>
              </div>

              {!notificacion.leida && <div className="notis-dot"></div>}
            </div>
          ))
        )}
        </div>
      </section>
    </main>
  );
};

export default Notis;