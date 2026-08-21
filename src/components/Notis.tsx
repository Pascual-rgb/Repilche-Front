import "./styles/Notis.css";

import {
  FaBell,
  FaHeart,
  FaShoppingBag,
  FaTag,
} from "react-icons/fa";

import { useNotificationContext } from "../context/NotificationContext";

interface Notificacion {
  id: number;
  tipo: "producto" | "favorito" | "oferta";
  titulo: string;
  descripcion: string;
  tiempo: string;
  leida: boolean;
}

const Notis = () => {
  const {
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationContext();

  const notificaciones: Notificacion[] = [
    {
      id: 1,
      tipo: "producto",
      titulo: "Nuevo interés en tu producto",
      descripcion:
        "Un usuario mostró interés en uno de los productos que publicaste.",
      tiempo: "Hace unos minutos",
      leida: unreadCount === 0,
    },
    {
      id: 2,
      tipo: "favorito",
      titulo: "Agregaron un producto a favoritos",
      descripcion:
        "A un usuario le gustó uno de los productos que publicaste.",
      tiempo: "Hace 1 hora",
      leida: unreadCount === 0,
    },
    {
      id: 3,
      tipo: "oferta",
      titulo: "Encontramos productos para vos",
      descripcion:
        "Hay nuevas prendas que podrían interesarte. ¡Entrá a descubrirlas!",
      tiempo: "Hace 1 día",
      leida: true,
    },
  ];

  const obtenerIcono = (tipo: Notificacion["tipo"]) => {
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

          {notificaciones.map((notificacion) => (
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

                <span>{notificacion.tiempo}</span>

              </div>

              {!notificacion.leida && (
                <div className="notis-dot"></div>
              )}

            </div>
          ))}

        </div>

      </section>
    </main>
  );
};

export default Notis;