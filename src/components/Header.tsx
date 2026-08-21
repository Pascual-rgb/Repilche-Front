import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaBell,
  FaShoppingCart,
} from "react-icons/fa";
import User from "./User";
import "./styles/Header.css";
import logo from "../assets/PICHE.png";
import { useNotificationContext } from "../context/NotificationContext";
import { useCarritoContext } from "../context/CartContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { unreadCount } = useNotificationContext();
  const { getItemQuantity } = useCarritoContext();

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <Link to="/" className="header-logo">
          <img
            src={logo}
            alt="Repilche"
            className="logo-image"
          />

          <div className="logo-text">
            <h1>REPILCHE</h1>
            <span>Moda Circular</span>
          </div>
        </Link>

        {/* BUSCADOR */}
        <div className="search-container">
          <input
            type="text"
            placeholder="¿Qué prenda estás buscando?"
          />

          <button>
            <FaSearch />
          </button>
        </div>

        {/* ICONOS */}
        <div className="desktop-icons">

          {/* CARRITO */}
          <Link
            to="/cart"
            className="header-icon cart"
            aria-label="Ir al carrito"
          >
            <FaShoppingCart />

            {getItemQuantity() > 0 && (
              <span className="badge">
                {getItemQuantity()}
              </span>
            )}
          </Link>

          {/* NOTIFICACIONES */}
          <Link
            to="/notifications"
            className="header-icon notification"
            aria-label="Ir a notificaciones"
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="badge">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* USUARIO */}
          <User />

        </div>

        {/* MENÚ MÓVIL */}
        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${menuOpen ? "open" : ""}`}>

        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          Inicio
        </Link>

        <a href="#">Hombre</a>

        <a href="#">Mujer</a>

        <a href="#">Calzado</a>

        <a href="#">Accesorios</a>

        <a href="#">Vender</a>

      </nav>
    </header>
  );
};

export default Header;