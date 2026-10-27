import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
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
  const lastScrollYRef = useRef(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const { unreadCount = 0 } = useNotificationContext();
  const { getItemQuantity, openCart } = useCarritoContext();
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${showHeader ? "header-visible" : "header-hidden"}`}>
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="header-logo">
          <img src={logo} alt="Repilche" className="logo-image" />
        </Link>

        {/* BUSCADOR */}
          <div className={`search-container ${searchOpen ? "search-open" : ""}`}>
            <input type="text" placeholder="¿Qué prenda estás buscando?" />
            <button>
              <FaSearch />
            </button>
          </div>

        {/* ICONOS */}
        <div className="desktop-icons">
          
              <button className="header-icon search-toggle" aria-label="Buscar" onClick={() => setSearchOpen(!searchOpen)}>
                {searchOpen ? <FaTimes /> : <FaSearch />}
              </button>

            {isLoggedIn ? (
            <>
              <button className="header-icon cart" aria-label="Ir al carrito" onClick={openCart}>
                <FaShoppingCart />
                {getItemQuantity() > 0 && <span className="badge">{getItemQuantity()}</span>}
              </button>

              <Link to="/notifications" className="header-icon notification" aria-label="Ir a notificaciones">
                <FaBell />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </Link>

              <User />
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn auth-btn-login">Iniciar sesión</Link>
              <Link to="/registro" className="auth-btn auth-btn-register">Registrarme</Link>
            </div>
          )}
        </div>

        {/* MENÚ MÓVIL */}
        {isLoggedIn && (
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* NAVBAR */}
      {isLoggedIn && (
        <nav className={`navbar ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/products?category=remera" onClick={() => setMenuOpen(false)}>Remeras</Link>
          <Link to="/products?category=pantalón" onClick={() => setMenuOpen(false)}>Pantalones</Link>
          <Link to="/products?category=calzado" onClick={() => setMenuOpen(false)}>Calzado</Link>
          <Link to="/products?category=accesorio" onClick={() => setMenuOpen(false)}>Accesorios</Link>
          <Link to="/ser-vendedor" onClick={() => setMenuOpen(false)}>Vender</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;