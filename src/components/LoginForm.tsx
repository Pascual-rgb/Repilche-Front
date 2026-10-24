import { useRef } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './styles/LoginForm.css'

const LoginForm = () => {
    const formRef = useRef<HTMLFormElement>(null)
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!formRef.current) return

        const data = new FormData(formRef.current)
        const usuario = Object.fromEntries(data)

        try {
            // Intentamos hacer login
            await login(usuario);
            
            // Si sale bien, redirigimos y limpiamos
            navigate("/");
            formRef.current?.reset();
        } catch (error) {
            // Si el backend rechaza las credenciales, capturamos el error aquí
            console.error("Error al iniciar sesión:", error);
            alert("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
        }
    }

    return(
        <>
        <div className='Login-header'>
            <h1 className=''>Inicio de Sesión</h1>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className='login-form'>
            <div>
                <label htmlFor="email" className="form-label mt-4">Email</label>
                <input 
                    type="email" 
                    name="email" /* <--- ¡Importante: Agregado name! */
                    className="form-control" 
                    id="email" 
                    aria-describedby="emailHelp" 
                    placeholder="tu@email.com" 
                    required 
                />
            </div>
            <div>
                <label htmlFor="password" className="form-label mt-4">Contraseña</label>
                <input 
                    type="password" 
                    name="password" /* <--- ¡Importante: Agregado name! */
                    className="form-control" 
                    id="password" 
                    placeholder="password" 
                    autoComplete="off" 
                    required 
                />
            </div>
            <button type='submit'>Enviar</button>
            <Link to="/registro" className="login-link">
                No tengo cuenta
            </Link>
        </form>
        </>
    )
}

export default LoginForm