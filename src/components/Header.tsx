import { useState } from "react";
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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">

      <div className="header-container">

        <a href="#" className="header-logo">
          <img src={logo} alt="Repilche" className="logo-image" />

          <div className="logo-text">
            <h1>REPILCHE</h1>
            <span>Moda Circular</span>
          </div>
        </a>

        <div className="search-container">
          <input
            type="text"
            placeholder="¿Qué prenda estás buscando?"
          />

          <button>
            <FaSearch />
          </button>
        </div>

        <div className="desktop-icons">

          <button className="header-icon cart">
            <FaShoppingCart />
            <span className="badge">2</span>
          </button>

          <button className="header-icon notification">
            <FaBell />
            <span className="badge">3</span>
          </button>

          <User />

        </div>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      <nav className={`navbar ${menuOpen ? "open" : ""}`}>
        <a href="#">Inicio</a>
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