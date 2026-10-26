import { useRef, useState } from "react";
import { FaUserCircle, FaSave, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import FeedbackCard from "./FeedbackCard";
import "./styles/EditarPerfil.css";

const EditarPerfil = () => {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [numberPhone, setNumberPhone] = useState("");
  const [actualizado, setActualizado] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    const data = new FormData(formRef.current);
    const datos = Object.fromEntries(data);
    console.log("Perfil actualizado:", datos);

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setActualizado(true);
  };

  return (
    <main className="editar-perfil-page">
      <section className="editar-perfil-container">
        <div className="editar-perfil-card">
          {actualizado ? (
            <FeedbackCard
              icon={<FaCheck />}
              title="¡Perfil actualizado con éxito!"
              message="Tus datos personales fueron modificados correctamente en tu cuenta de Repilche."
              actionText="Volver al inicio"
              actionTo="/"
              secondaryActionText="Seguir editando"
              onSecondaryAction={() => setActualizado(false)}
            />
          ) : (
            <>
              <div className="editar-perfil-header">
                <FaUserCircle className="editar-perfil-avatar" />

                <div>
                  <h1>Editar perfil</h1>
                  <p>Modificá tus datos personales de Repilche.</p>
                </div>
              </div>

              <form
                ref={formRef}
                className="editar-perfil-form"
                onSubmit={handleSubmit}
              >
                <div className="editar-perfil-field">
                  <label htmlFor="nombre">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                    minLength={3}
                  />
                </div>

                <div className="editar-perfil-field">
                  <label htmlFor="usuario">Nombre de usuario</label>
                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ej: juanperez23"
                    required
                    minLength={3}
                    maxLength={20}
                  />
                </div>

                <div className="editar-perfil-field">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej: juan@ejemplo.com"
                    required
                  />
                </div>

                <div className="editar-perfil-field">
                  <label htmlFor="numberPhone">Número Telefónico</label>
                  <input
                    type="tel"
                    id="numberPhone"
                    name="numberPhone"
                    value={numberPhone}
                    onChange={(e) => setNumberPhone(e.target.value)}
                    placeholder="Ej: 2804123456"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    minLength={8}
                    maxLength={15}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </div>

                <div className="editar-perfil-actions">
                  <Link to="/" className="editar-perfil-cancelar">
                    Cancelar
                  </Link>

                  <button type="submit" className="editar-perfil-guardar">
                    <FaSave />
                    Guardar cambios
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default EditarPerfil;