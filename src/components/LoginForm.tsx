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

       const data = new FormData (formRef.current)
       const usuario = Object.fromEntries(data)
       console.log(usuario)

       await login(usuario);
       navigate("/");

       formRef.current?.reset()

    }

    return(
        <>
        <div className='Login-header'>
            <h1 className=''>Inicio de Sesión</h1>
        </div>

        <form ref = {formRef} onSubmit={handleSubmit} className='login-form'>
            <div>
                <label htmlFor="email" className="form-label mt-4">Email</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="tu@email.com" />
            </div>
            <div>
                <label htmlFor="password" className="form-label mt-4">Contraseña</label>
                <input type="password" className="form-control" id="password" placeholder="password" autoComplete="off" />
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