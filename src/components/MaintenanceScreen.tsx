import React, { useEffect } from 'react';
import { FaInstagram, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import logo from '../assets/PICHE.png';
import './styles/MaintenanceScreen.css';

export const MaintenanceScreen: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.replace("https://repilche-web.vercel.app/");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="maintenance-wrapper">
      <div className="maintenance-card">
        {/* Identidad / Logo */}
        <div className="maintenance-header">
          <img src={logo} alt="Repilche Logo" className="maintenance-logo" />
          <div className="maintenance-badge">
            <span className="maintenance-pulse"></span>
            <span>Redirección a nueva web</span>
          </div>
        </div>

        {/* Título y Mensaje */}
        <div className="maintenance-body">
          <h1 className="maintenance-title">¡Nos mudamos de dirección!</h1>
          <p className="maintenance-description">
            Te estamos llevando a la nueva web oficial de Repilche...
          </p>
        </div>

        {/* Botón manual de respaldo */}
        <div className="maintenance-actions">
          <a
            href="https://repilche-web.vercel.app/"
            className="maintenance-reload-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Ir a la nueva tienda ahora</span>
            <FaExternalLinkAlt style={{ fontSize: '12px' }} />
          </a>
        </div>

        {/* Contacto / Soporte */}
        <div className="maintenance-footer">
          <p className="maintenance-support-text">
            ¿Tenés alguna consulta sobre tus pedidos o publicaciones?
          </p>
          <div className="maintenance-contact-links">
            <a
              href="https://instagram.com/repilche"
              target="_blank"
              rel="noopener noreferrer"
              className="maintenance-contact-link"
            >
              <FaInstagram /> @repilche
            </a>
            <span className="maintenance-divider">•</span>
            <a
              href="mailto:contacto@repilche.com"
              className="maintenance-contact-link"
            >
              <FaEnvelope /> contacto@repilche.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;

