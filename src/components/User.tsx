import { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaUserEdit,
  FaBoxOpen,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./styles/User.css";

const User = () => {
  const [open, setOpen] = useState(false);

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
              <h3>David</h3>
              <p>david@repilche.com</p>
            </div>
          </div>

          <hr />

          <button type="button">
            <FaUserEdit />
            <span>Editar perfil</span>
          </button>

          <button type="button">
            <FaBoxOpen />
            <span>Cargar producto</span>
          </button>

          <button type="button">
            <FaClipboardList />
            <span>Mis productos</span>
          </button>

          <button type="button">
            <FaCog />
            <span>Configuración</span>
          </button>

          <button type="button" className="logout">
            <FaSignOutAlt />
            <span>Cerrar sesión</span>
          </button>

        </div>
      )}
    </div>
  );
};

export default User;