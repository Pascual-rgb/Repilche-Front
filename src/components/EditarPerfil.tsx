import { useRef, useState, useEffect } from "react";
import { FaUserCircle, FaSave, FaCheck, FaCamera, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { uploadAvatarImage } from "../services/storageService";
import FeedbackCard from "./FeedbackCard";
import "./styles/EditarPerfil.css";

const EditarPerfil = () => {
  const { user, updateUser } = useAuthContext();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [actualizado, setActualizado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Inicializar campos con los datos reales del usuario logueado
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawUser = user as any;
      setNombre(user.nombre || user.first_name || rawUser.nombre || "");
      setApellido(user.apellido || user.last_name || rawUser.apellido || "");
      setEmail(user.email || "");
      setTelefono(user.telefono || user.phone || user.numberPhone || user.celphone || rawUser.telefono || "");
      
      const avatarUrl =
        user.avatar ||
        user.foto ||
        user.avatar_url ||
        user.image ||
        rawUser.avatar ||
        rawUser.foto ||
        rawUser.avatar_url ||
        rawUser.image ||
        null;

      setAvatarPreview(avatarUrl);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    setGuardando(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("repilche-token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

      // 1. Si hay una nueva imagen seleccionada, subir directamente a Supabase Storage
      let urlPublicaAvatar = avatarPreview;
      if (avatarFile) {
        try {
          urlPublicaAvatar = await uploadAvatarImage(avatarFile, user?.id);
        } catch (storageErr) {
          console.error("Error al subir avatar a Supabase:", storageErr);
          throw new Error("No se pudo subir la foto de perfil a Supabase Storage. Verificá tu conexión e intentá de nuevo.");
        }
      }

      // 2. Enviar JSON estándar al backend Django (sin FormData binario)
      const payload = {
        first_name: nombre,
        nombre: nombre,
        last_name: apellido,
        apellido: apellido,
        email,
        phone: telefono,
        telefono: telefono,
        numberPhone: telefono,
        avatar: urlPublicaAvatar || "",
        foto: urlPublicaAvatar || "",
      };

      if (token) {
        const res = await fetch(`${apiUrl}/usuario/me/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.warn("Respuesta no OK de /usuario/me/:", res.status);
        }
      }

      // 3. Persistir en el AuthContext y localStorage
      updateUser({
        first_name: nombre,
        name: nombre,
        nombre: nombre,
        last_name: apellido,
        lastName: apellido,
        apellido: apellido,
        email,
        phone: telefono,
        telefono: telefono,
        numberPhone: telefono,
        avatar: urlPublicaAvatar || undefined,
        foto: urlPublicaAvatar || undefined,
        avatar_url: urlPublicaAvatar || undefined,
        image: urlPublicaAvatar || undefined,
      });

      setAvatarFile(null);
      setAvatarPreview(urlPublicaAvatar);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setActualizado(true);
    } catch (err: unknown) {
      console.error("Error al actualizar perfil:", err);
      const msg = err instanceof Error ? err.message : "Ocurrió un error al actualizar tus datos.";
      setErrorMsg(msg);
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
                <div className="avatar-upload-container">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="avatar-img-preview" />
                  ) : (
                    <FaUserCircle className="editar-perfil-avatar" />
                  )}

                  <label htmlFor="avatar-input" className="avatar-upload-badge" title="Cambiar foto de perfil">
                    <FaCamera />
                  </label>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
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
                {errorMsg && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#dc2626",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    role="alert"
                  >
                    <FaExclamationTriangle style={{ flexShrink: 0 }} />
                    <span>{errorMsg}</span>
                  </div>
                )}

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
                    {guardando ? (
                      <>
                        <FaSpinner className="spin-icon" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Guardar cambios</span>
                      </>
                    )}
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
