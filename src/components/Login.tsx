import { useRef } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom';

const Login = () => {
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
       e.preventDefault()
       
        if (!formRef.current) return

       const data = new FormData (formRef.current)
       const usuario = Object.fromEntries(data)
       console.log(usuario)

       formRef.current.reset()

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
        </form>
        
        <Link to="/registro" className="login-link">
        No tengo cuenta
        </Link>
        </>
)
}
export default Login