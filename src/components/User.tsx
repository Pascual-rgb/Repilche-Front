import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useCarritoContext } from "../context/CartContext";
import {
  FaUserCircle,
  FaUserEdit,
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaShoppingBag,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import { checkIsAdmin } from "../utils/auth";

import "./styles/User.css";

const User = () => {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const { emptyCart } = useCarritoContext();
  const isAdmin = checkIsAdmin(user);

  const userContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userContainerRef.current &&
        !userContainerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    const handleLogout = async () => {
      await logout();
      emptyCart();
      setOpen(false);
      navigate("/login");
    }

  const nombreUsuario = user
    ? `${user.name || user.first_name || ""} ${user.lastName || user.last_name || ""}`.trim() || user.username || "Usuario"
    : "Usuario";

  return (
    <div className="user-container" ref={userContainerRef}>
      <button
        className="user-button"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú de usuario"
      >
        <FaUserCircle />
      </button>

      {open && (
        <div className="user-menu">

          <div className="user-header">
            <FaUserCircle className="user-avatar" />

            <div className="user-info">
              <h3>{nombreUsuario}</h3>
              <p>{user?.email || "usuario@repilche.com"}</p>
            </div>
          </div>

          <hr />

          <Link to="/editar-perfil" className="user-menu-link" onClick={() => setOpen(false)}>
          <FaUserEdit />
          <span>Editar perfil</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin/moderacion"
              className="user-menu-link"
              onClick={() => setOpen(false)}
            >
              <FaShieldAlt style={{ color: "#e0a800" }} />
              <span>Panel de Moderación</span>
            </Link>
          )}

          <Link
            to="/cargar-producto"
            className="user-menu-link"
            onClick={() => setOpen(false)}
          >
            <FaBoxOpen />
            <span>Cargar producto</span>
          </Link>

          {!user?.is_vendedor && (
            <Link
              to="/ser-vendedor"
              className="user-menu-link"
              onClick={() => setOpen(false)}
            >
              <FaStore />
              <span>Ser vendedor</span>
            </Link>
          )}

          <Link to="/mis-productos" className="user-menu-link" onClick={() => setOpen(false)}>
            <FaClipboardList />
            <span>Mis productos</span>
          </Link>

          <Link to="/mis-compras" className="user-menu-link" onClick={() => setOpen(false)}>
            <FaShoppingBag />
            <span>Mis compras</span>
          </Link>

          <Link to="/mis-ventas" className="user-menu-link" onClick={() => setOpen(false)}>
            <FaMoneyBillWave />
            <span>Mis ventas</span>
          </Link>

          <button type="button" className="logout" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Cerrar sesión</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default User;