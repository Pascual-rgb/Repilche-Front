import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import '../components/styles/CheckoutModal.css';
import './styles/RegistroForm.css'

const RegistroForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { register } = useAuthContext(); // <--- Usamos register en lugar de login
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsLoading(true);
    setFeedback(null);

    const data = new FormData(formRef.current);
    const usuario = Object.fromEntries(data);

    try {
      await register(usuario);
      
      setIsLoading(false);
      setFeedback({
        show: true,
        type: 'success',
        title: '¡Registro exitoso!',
        message: 'Tu cuenta fue creada correctamente. Por favor, inicia sesión con tus credenciales.'
      });

      setTimeout(() => {
        navigate("/login");
        formRef.current?.reset();
      }, 2500);

    } catch (error: any) {
      console.error("Error al registrarse:", error);
      setIsLoading(false);

      const esErrorDeConexion = error?.message?.includes("Failed to fetch") || error?.name === "TypeError";
      let mensajeAmigable = "Por favor, verificá los datos ingresados.";

      if (esErrorDeConexion) {
        mensajeAmigable = "No pudimos conectar con el servidor. Por favor, revisá tu conexión o intentá de nuevo más tarde.";
      } else if (error?.message) {
        try {
          const parsed = JSON.parse(error.message);
          if (typeof parsed === "string") {
            mensajeAmigable = parsed;
          } else if (Array.isArray(parsed)) {
            mensajeAmigable = parsed.join(" ");
          } else if (typeof parsed === "object" && parsed !== null) {
            mensajeAmigable = Object.entries(parsed)
              .map(([key, val]) => `${key === "detail" ? "" : key + ": "}${Array.isArray(val) ? val.join(", ") : val}`)
              .join(" | ");
          }
        } catch {
          mensajeAmigable = error.message;
        }
      }

      setFeedback({
        show: true,
        type: 'error',
        title: 'Aviso de registro',
        message: mensajeAmigable
      });
    }
  };

  return (
    <div className="Registro-header">
      <h1>Registro</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="registro-form">
        <div>
          <label htmlFor="name" className="form-label mt-4">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Tu Nombre"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="form-label mt-4">
            Apellido
          </label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            placeholder="Tu Apellido"
            required
          />
        </div>

        <div>
          <label htmlFor="numberPhone" className="form-label mt-4">
            Número Telefónico
          </label>
          <input
            type="tel"
            className="form-control"
            id="numberPhone"
            name="numberPhone"
            placeholder="Ej: 2804123456"
            inputMode="numeric"
            pattern="[0-9]*"
            required
            minLength={8}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
            }}
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label mt-4">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="tu@email.com"
            required
          />
          <small id="emailHelp" className="form-text text-muted">
            Tu email está seguro con nosotros.
          </small>
        </div>

        <div>
          <label htmlFor="password" className="form-label mt-4">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Contraseña"
            autoComplete="off"
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? <div className="checkout-spinner"></div> : 'Enviar'}
        </button>
        <Link to="/login" className="registro-link">
          Ya tengo una cuenta
        </Link>
      </form>

      {(isLoading || (feedback && feedback.show)) && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-card" style={{ textAlign: 'center', alignItems: 'center' }}>
            
            {isLoading && (
              <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="checkout-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
                <h3 style={{ fontFamily: 'Viga', fontSize: '22px', margin: 0 }}>Creando cuenta...</h3>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Estamos registrando tus datos en Repilche.</p>
              </div>
            )}

            {!isLoading && feedback && feedback.show && (
              <>
                <div className="checkout-exito-icon" style={{
                  background: feedback.type === 'success' ? '#e8f5e9' : '#ffebee',
                  color: feedback.type === 'success' ? '#2e7d32' : '#c62828'
                }}>
                  {feedback.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
                </div>

                <div className="checkout-modal-header">
                  <h2>{feedback.title}</h2>
                  <p>{feedback.message}</p>
                </div>

                <button 
                  type="button" 
                  className="checkout-btn-compras"
                  onClick={() => setFeedback(null)}
                >
                  Entendido
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroForm;