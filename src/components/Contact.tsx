import "./styles/Contact.css";
import logo from "../assets/PICHE.png";

/*import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaEnvelope,
} from "react-icons/fa";*/

const Contact = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LOGO + DESCRIPCIÓN */}
        <div className="footer-brand">

          <img
            src={logo}
            alt="Repilche"
            className="footer-logo"
          />

          <div className="footer-brand-text">
            <h2>REPILCHE</h2>

            <p>
              Moda circular para todos.
              <br />
              Comprá y vendé ropa usada de forma simple,
              <br />
              segura y sostenible.
            </p>
          </div>

        </div>

        {/* REDES SOCIALES */}
        <div className="footer-section">

          <h3>Redes Sociales</h3>

          <a
            href="https://www.facebook.com/share/18FU1xW9a1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF />
            Facebook
          </a>

          <a
            href="https://www.instagram.com/repilche.web?igsh=MXZ2MGNhOG5panVseQ=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
            Instagram
          </a>

          <a
            href="https://www.tiktok.com/@repilche.app?_r=1&_t=ZS-98nnbpK9CIa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTiktok />
            TikTok
          </a>

          <a href="mailto:repilchecontact@gmail.com">
            <FaEnvelope />
            repilchecontact@gmail.com
          </a>

        </div>

        {/* INFORMACIÓN */}
        <div className="footer-section">

          <h3>Información</h3>

          <a href="/ayuda">Ayuda</a>

          <a href="/politicas">Políticas</a>

          <a href="/terminos">
            Términos y condiciones
          </a>

          <a href="mailto:repilchecontact@gmail.com">
            Contacto
          </a>

        </div>

      </div>

      <div className="footer-copy">
        © 2026 REPILCHE - Todos los derechos reservados.
      </div>

    </footer>
  );
};

export default Contact;