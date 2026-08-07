import "./Contact.css";
import logo from "../assets/PICHE.png";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
} from "react-icons/fa";

const Contact = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Marca */}
        <div className="footer-brand">

          <img
            src={logo}
            alt="Logo Repilche"
            className="footer-logo"
          />

          <div className="footer-brand-text">
            <h2>REPILCHE</h2>

            <p>
              Moda circular para todos.
              <br />
              Comprá y vendé ropa usada de forma simple,
              segura y sostenible.
            </p>
          </div>

        </div>

        {/* Redes */}
        <div className="footer-section">

          <h3>Redes Sociales</h3>

          <a href="#">
            <FaFacebookF />
            <span>Facebook</span>
          </a>

          <a href="#">
            <FaInstagram />
            <span>Instagram</span>
          </a>

          <a href="#">
            <FaTiktok />
            <span>TikTok</span>
          </a>

          <a href="mailto:contacto@repilche.com">
            <FaEnvelope />
            <span>contacto@repilche.com</span>
          </a>

        </div>

        {/* Información */}
        <div className="footer-section">

          <h3>Información</h3>

          <a href="#">Ayuda</a>
          <a href="#">Políticas</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Contacto</a>

        </div>

      </div>

      <div className="footer-copy">
        © 2026 REPILCHE - Todos los derechos reservados.
      </div>

    </footer>
  );
};

export default Contact;