import { useRef } from 'react'
import type { FormEvent } from 'react'

const RegistroForm = () => {
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
        <div className='Registro-header'>
            <h1 className=''>Registro</h1>
             <form ref = {formRef} onSubmit={handleSubmit} className='registro-form'>
            <div>
                <label htmlFor="name" className="form-label mt-4">Nombre</label>
                <input type="text" className="form-control" id="name" placeholder="Tu Nombre" />
            </div>
            <div>
                <label htmlFor="lastName" className="form-label mt-4">Apellido</label>
                <input type="text" className="form-control" id="lastName" placeholder="Tu Apellido" />
            </div>
            <div>
                <label htmlFor="numberPhone" className="form-label mt-4">Número</label>
                <input type="text" className="form-control" id="numberPhone" placeholder="Tu número" />
            </div>
            <div>
                <label htmlFor="email" className="form-label mt-4">Email</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="tu@email.com" />
                <small id="emailHelp" className="form-text text-muted">Tu email está seguro con nosotros.</small>
            </div>
            <div>
                <label htmlFor="password" className="form-label mt-4">Contraseña</label>
                <input type="password" className="form-control" id="password" placeholder="password" autoComplete="off" />
            </div>
            <button type='submit'>Enviar</button>
        </form>
        </div>
    )
}
       

export default RegistroForm