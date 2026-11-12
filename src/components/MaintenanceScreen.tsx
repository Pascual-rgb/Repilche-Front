import React from 'react';
import { FaWrench, FaSyncAlt, FaInstagram, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/PICHE.png';
import './styles/MaintenanceScreen.css';

interface MaintenanceScreenProps {
  onRefresh?: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onRefresh }) => {
  const handleReload = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="maintenance-wrapper">
      <div className="maintenance-card">
        {/* Identidad / Logo */}
        <div className="maintenance-header">
          <img src={logo} alt="Repilche Logo" className="maintenance-logo" />
          <div className="maintenance-badge">
            <span className="maintenance-pulse"></span>
            <FaWrench className="maintenance-badge-icon" />
            <span>Mantenimiento en curso</span>
          </div>
        </div>

        {/* Título y Mensaje */}
        <div className="maintenance-body">
          <h1 className="maintenance-title">¡Estamos mejorando Repilche para vos!</h1>
          <p className="maintenance-description">
            En este momento estamos realizando tareas de mantenimiento y actualización en nuestra plataforma. Volvemos en unos minutos con todo el catálogo disponible.
          </p>
        </div>

        {/* Botón de verificación/recarga */}
        <div className="maintenance-actions">
          <button
            type="button"
            className="maintenance-reload-btn"
            onClick={handleReload}
            title="Verificar si la plataforma ya está disponible"
          >
            <FaSyncAlt className="maintenance-reload-icon" />
            <span>Verificar disponibilidad</span>
          </button>
        </div>

        {/* Contacto / Soporte */}
        <div className="maintenance-footer">
          <p className="maintenance-support-text">
            ¿Tenés alguna consulta urgente sobre un pedido en curso?
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

