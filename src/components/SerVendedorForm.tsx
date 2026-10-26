import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'
import FeedbackCard from './FeedbackCard';
import './styles/SerVendedorForm.css';

const SerVendedorForm = () => {
    const [registrado, setRegistrado] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       
        if (!formRef.current) return

        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity()
            return
        }

        const data = new FormData(formRef.current)
        const usuario = Object.fromEntries(data)
        console.log(usuario)

        formRef.current.reset()
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
        setRegistrado(true)
    }

    const handleCancelar = () => {
        if (window.history.length > 1) {
            navigate(-1)
        } else {
            navigate("/")
        }
    }

  return(
    <div className="serVendedor-page">
      <div className="serVendedor-container">
        <div className="serVendedor-card">
          {registrado ? (
            <FeedbackCard
              icon={<FaCheck />}
              title="¡Ya sos parte de la comunidad de vendedores!"
              message="Tu solicitud fue enviada con éxito. Ya podés empezar a publicar tus prendas en Repilche."
              actionText="Publicar mi primera prenda"
              actionTo="/cargar-producto"
            />
          ) : (
            <>
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
                    <input 
                      type="text" 
                      className="form-control" 
                      id="locality" 
                      name="locality" 
                      placeholder="Ej: Trelew, Rawson, Gaiman..." 
                      required
                      minLength={3}
                    />
                </div>
                <div>
                    <label htmlFor="llegoHasta" className="form-label">Llego hasta</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="llegoHasta" 
                      name="llegoHasta" 
                      placeholder="Ej: Trelew, Rawson, Gaiman..." 
                      required
                      minLength={3}
                    />
                </div>
                <div>
                    <label htmlFor="alias" className="form-label">Alias</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="alias" 
                      name="alias" 
                      placeholder="Ej: tu.alias.mp"
                      required
                      minLength={6}
                      maxLength={20}
                      pattern="^[a-zA-Z0-9.]{6,20}$"
                      title="El alias debe tener entre 6 y 20 caracteres alfanuméricos o puntos"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z0-9.]/g, "");
                      }}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="form-label">
                      Descripción <span style={{ fontWeight: 'normal', color: '#777', fontSize: '13px' }}>(opcional)</span>
                    </label>
                    <textarea 
                      className="form-control" 
                      id="description" 
                      name="description" 
                      rows={3} 
                      placeholder="Contanos sobre tu estilo, las marcas que vendés o cualquier detalle adicional que quieras sumar (opcional)..."
                    />
                </div>

                <div className="serVendedor-buttons">
                  <button type="button" className="btn-cancel" onClick={handleCancelar}>Cancelar</button>
                  <button type='submit' className="btn-save">Enviar</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default SerVendedorForm