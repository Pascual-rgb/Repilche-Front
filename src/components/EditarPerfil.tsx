import { useRef, useState, useEffect } from "react";
import { FaUserCircle, FaSave, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import FeedbackCard from "./FeedbackCard";
import "./styles/EditarPerfil.css";

const EditarPerfil = () => {
  const { user, updateUser } = useAuthContext();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [actualizado, setActualizado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Inicializar campos con los datos reales del usuario logueado
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawUser = user as any;
      setNombre(user.first_name || user.name || rawUser.nombre || "");
      setApellido(user.last_name || user.lastName || rawUser.apellido || "");
      setEmail(user.email || "");
      setTelefono(user.phone || user.numberPhone || user.celphone || rawUser.telefono || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    setGuardando(true);
    try {
      const token = localStorage.getItem("repilche-token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

      if (token) {
        await fetch(`${apiUrl}/usuario/me/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: nombre,
            last_name: apellido,
            email,
            phone: telefono,
            numberPhone: telefono,
          }),
        }).catch((err) => console.warn("No se pudo actualizar en API:", err));
      }

      updateUser({
        first_name: nombre,
        name: nombre,
        last_name: apellido,
        lastName: apellido,
        email,
        phone: telefono,
        numberPhone: telefono,
      });

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setActualizado(true);
    } finally {
      setGuardando(false);
    }
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
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Juan"
                    required
                    minLength={2}
                  />
                </div>

                <div className="editar-perfil-field">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Ej: Pérez"
                    required
                    minLength={2}
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
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
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

                  <button
                    type="submit"
                    className="editar-perfil-guardar"
                    disabled={guardando}
                  >
                    <FaSave />
                    {guardando ? "Guardando..." : "Guardar cambios"}
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
