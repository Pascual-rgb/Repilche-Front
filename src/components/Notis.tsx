import "./styles/Notis.css";

import {
  FaBell,
  FaHeart,
  FaShoppingBag,
  FaTag,
} from "react-icons/fa";

const Notis = () => {
  return (
    <main className="notis-page">
      <section className="notis-container">
        <div className="notis-header">
          <div>
            <h1>Notificaciones</h1>
            <p>Mantenete al día con las novedades de Repilche.</p>
          </div>

          <FaBell className="notis-main-icon" />
        </div>

        <div className="notis-list">

          <div className="notis-card unread">
            <div className="notis-icon product-icon">
              <FaShoppingBag />
            </div>

            <div className="notis-content">
              <h3>Nuevo interés en tu producto</h3>
              <p>
                Un usuario mostró interés en uno de los productos que publicaste.
              </p>
              <span>Hace unos minutos</span>
            </div>

            <div className="notis-dot"></div>
          </div>

          <div className="notis-card unread">
            <div className="notis-icon heart-icon">
              <FaHeart />
            </div>

            <div className="notis-content">
              <h3>Agregaron un producto a favoritos</h3>
              <p>
                A un usuario le gustó uno de los productos que publicaste.
              </p>
              <span>Hace 1 hora</span>
            </div>

            <div className="notis-dot"></div>
          </div>

          <div className="notis-card">
            <div className="notis-icon tag-icon">
              <FaTag />
            </div>

            <div className="notis-content">
              <h3>Encontramos productos para vos</h3>
              <p>
                Hay nuevas prendas que podrían interesarte. ¡Entrá a descubrirlas!
              </p>
              <span>Hace 1 día</span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Notis;