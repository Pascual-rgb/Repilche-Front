import { useState, useEffect } from "react";
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
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { unreadCount } = useNotificationContext();
  const { getItemQuantity } = useCarritoContext();

  // Controlar el scroll hacia arriba y hacia abajo
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Si bajamos y ya pasamos los 80px, ocultamos el header
        setShowHeader(false);
      } else {
        // Si subimos, mostramos el header
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${showHeader ? "header-visible" : "header-hidden"}`}>
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="header-logo">
          <img src={logo} alt="Repilche" className="logo-image" />
          <div className="logo-text">
            <h1>REPILCHE</h1>
            <span>Moda Circular</span>
          </div>
        </Link>

        {/* BUSCADOR */}
        <div className="search-container">
          <input type="text" placeholder="¿Qué prenda estás buscando?" />
          <button>
            <FaSearch />
          </button>
        </div>

        {/* ICONOS */}
        <div className="desktop-icons">
          <Link to="/cart" className="header-icon cart" aria-label="Ir al carrito">
            <FaShoppingCart />
            {getItemQuantity() > 0 && <span className="badge">{getItemQuantity()}</span>}
          </Link>

          <Link to="/notifications" className="header-icon notification" aria-label="Ir a notificaciones">
            <FaBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>

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
        <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/products?gender=hombre" onClick={() => setMenuOpen(false)}>Hombre</Link>
        <Link to="/products?gender=mujer" onClick={() => setMenuOpen(false)}>Mujer</Link>
        <Link to="/products?category=calzado" onClick={() => setMenuOpen(false)}>Calzado</Link>
        <Link to="/products?category=accesorios" onClick={() => setMenuOpen(false)}>Accesorios</Link>
        <Link to="/ser-vendedor" onClick={() => setMenuOpen(false)}>Vender</Link>
      </nav>
    </header>
  );
};

export default Header;