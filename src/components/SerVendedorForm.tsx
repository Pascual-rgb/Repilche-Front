import { useRef } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './styles/SerVendedorForm.css';

const SerVendedorForm = () => {
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
      <div className="serVendedor-page">
        <Link to="/" className="volver-btn">
          <span>&#8592;</span> Volver al inicio
        </Link>

        <div className="serVendedor-card">
          <div className="serVendedor-card-header">
            <div>
              <h1>Ser vendedor</h1>
              <p>Completá tus datos para empezar a vender en Repilche.</p>
            </div>
          </div>

          <hr className="serVendedor-divider" />

          <form ref={formRef} onSubmit={handleSubmit} className='serVendedor-form'>
            <div>
                <label htmlFor="locality" className="form-label">Localidad</label>
                <input type="text" className="form-control" id="locality" name="locality" placeholder="Localidad" />
            </div>
            <div>
                <label htmlFor="llegoHasta" className="form-label">Llego hasta</label>
                <input type="text" className="form-control" id="llegoHasta" name="llegoHasta" placeholder="Llego hasta...(localidades)" />
            </div>
            <div>
                <label htmlFor="cvu" className="form-label">CVU</label>
                <input type="text" className="form-control" id="cvu" name="cvu" placeholder="CVU(CBU)" />
            </div>
            <div>
                <label htmlFor="description" className="form-label">Descripción</label>
                <textarea className="form-control" id="description" name="description" rows={3} />
            </div>

            <div className="serVendedor-buttons">
              <button type="button" className="btn-cancel">Cancelar</button>
              <button type='submit' className="btn-save">Enviar</button>
            </div>
          </form>
        </div>
      </div>
    )
}
export default SerVendedorForm