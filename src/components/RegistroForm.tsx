import { useRef } from "react";
import type { FormEvent } from "react";
import './styles/RegistroForm.css'
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const RegistroForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { register } = useAuthContext(); // <--- Usamos register en lugar de login
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const usuario = Object.fromEntries(data);

    console.log("Datos de registro:", usuario);

    try {
      // Llamamos a la función de registro del contexto
      await register(usuario);
      
      alert("¡Registro exitoso! Por favor, inicia sesión con tus nuevas credenciales.");
      navigate("/login"); // Redirigimos al login tras registrarse con éxito
      
      formRef.current?.reset();
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      alert(error.message || "Hubo un error al procesar el registro.");
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

        <button type="submit">Enviar</button>
        <Link to="/login" className="registro-link">
          Ya tengo una cuenta
        </Link>
      </form>
    </div>
  );
};

export default RegistroForm;