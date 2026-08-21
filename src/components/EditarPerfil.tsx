import { useState } from "react";
import { FaUserCircle, FaSave, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./styles/EditarPerfil.css";

const EditarPerfil = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Perfil actualizado:", {
      nombre,
      email,
    });

    alert("Perfil actualizado correctamente");
  };

  return (
    <main className="editar-perfil-page">
      <section className="editar-perfil-container">

        <Link to="/" className="editar-perfil-volver">
          <FaArrowLeft />
          Volver al inicio
        </Link>

        <div className="editar-perfil-card">

          <div className="editar-perfil-header">
            <FaUserCircle className="editar-perfil-avatar" />

            <div>
              <h1>Editar perfil</h1>
              <p>
                Modificá tus datos personales de Repilche.
              </p>
            </div>
          </div>

          <form
            className="editar-perfil-form"
            onSubmit={handleSubmit}
          >

            <div className="editar-perfil-field">
              <label htmlFor="nombre">
                Nombre
              </label>

              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresá tu nombre"
              />
            </div>

            <div className="editar-perfil-field">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresá tu correo"
              />
            </div>

            <div className="editar-perfil-field">
              <label htmlFor="usuario">
                Nombre de usuario
              </label>

              <input
                type="text"
                id="usuario"
                defaultValue=""
                placeholder="Nombre de usuario"
              />
            </div>

            <div className="editar-perfil-actions">

              <Link
                to="/"
                className="editar-perfil-cancelar"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="editar-perfil-guardar"
              >
                <FaSave />
                Guardar cambios
              </button>

            </div>

          </form>

        </div>

      </section>
    </main>
  );
};

export default EditarPerfil;