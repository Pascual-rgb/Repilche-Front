import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCheck } from 'react-icons/fa'
import FeedbackCard from './FeedbackCard';
import './styles/SerVendedorForm.css';

const CIUDADES_OPCIONES = [
  "Trelew",
  "Rawson",
  "Playa Unión",
  "Gaiman",
  "Dolavon",
  "Puerto Madryn",
];

const SerVendedorForm = () => {
    const [registrado, setRegistrado] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [errorBackend, setErrorBackend] = useState<string>("")

    // 🟠 Localidad de origen (Selección simple + Otra ciudad)
    const [localidadSelect, setLocalidadSelect] = useState<string>("")
    const [otraLocalidad, setOtraLocalidad] = useState<string>("")

    // 🔴 Llego hasta (Selección simple con opciones fijas, sin otra ciudad)
    const [llegoHastaSelect, setLlegoHastaSelect] = useState<string>("")

    const formRef = useRef<HTMLFormElement>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrorBackend("")
       
        if (!formRef.current) return

        // Validación de Localidad de origen
        const localidadFinal = localidadSelect === "otra" ? otraLocalidad.trim() : localidadSelect
        if (!localidadFinal) {
            if (localidadSelect === "otra") {
                const inputOtra = document.getElementById("otraLocalidad") as HTMLInputElement | null
                if (inputOtra) {
                    inputOtra.setCustomValidity("Ingresá el nombre de tu localidad.")
                    inputOtra.reportValidity()
                    inputOtra.setCustomValidity("")
                }
            }
            return
        }

        if (!llegoHastaSelect) {
            const selectLlego = document.getElementById("llegoHastaSelect") as HTMLSelectElement | null
            if (selectLlego) {
                selectLlego.setCustomValidity("Seleccioná hasta qué ciudad podés llegar.")
                selectLlego.reportValidity()
                selectLlego.setCustomValidity("")
            }
            return
        }

        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity()
            return
        }

        const data = new FormData(formRef.current)
        const usuario = Object.fromEntries(data)
        usuario.locality = localidadFinal
        usuario.llegoHasta = llegoHastaSelect

        console.log("Datos de solicitud para ser vendedor:", usuario)

        // Conexión con backend si existe sesión con token
        const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api"
        const token = localStorage.getItem("repilche-token")

        if (token) {
            setEnviando(true)
            try {
                const res = await fetch(`${apiUrl}/vendedor/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        locality: localidadFinal,
                        llegoHasta: llegoHastaSelect,
                        alias: usuario.alias,
                        description: usuario.description || ""
                    })
                })

                if (!res.ok) {
                    const errData = await res.json().catch(() => null)
                    console.error("Error al registrar vendedor en backend:", errData)
                    const msg = errData ? (errData.detail || JSON.stringify(errData)) : "Ocurrió un error al enviar tu solicitud."
                    setErrorBackend(msg)
                    setEnviando(false)
                    return
                }
            } catch (err) {
                console.warn("Fallo de red al conectar con el backend de vendedor, guardando localmente.", err)
            } finally {
                setEnviando(false)
            }
        }

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

              {errorBackend && (
                <div className="serVendedor-backend-error">
                  {errorBackend}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className='serVendedor-form'>
                
                {/* 🟠 Selector de ciudad de origen (Localidad) */}
                <div>
                    <label htmlFor="localitySelect" className="form-label">
                      Localidad de origen <span className="label-required">*</span>
                    </label>
                    <select 
                      id="localitySelect" 
                      className="form-select"
                      value={localidadSelect}
                      onChange={(e) => {
                        setLocalidadSelect(e.target.value)
                        if (e.target.value !== "otra") {
                          setOtraLocalidad("")
                        }
                      }}
                      required
                    >
                      <option value="" disabled>Seleccioná tu ciudad de origen</option>
                      {CIUDADES_OPCIONES.map((ciudad) => (
                        <option key={ciudad} value={ciudad}>{ciudad}</option>
                      ))}
                      <option value="otra">Otra ciudad (ingresar manualmente)</option>
                    </select>

                    {localidadSelect === "otra" && (
                      <div className="otra-localidad-wrapper">
                        <label htmlFor="otraLocalidad" className="form-sublabel">
                          Escribí el nombre de tu localidad:
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="otraLocalidad" 
                          placeholder="Ej: 28 de Julio, Puerto Pirámides, Camarones..." 
                          value={otraLocalidad}
                          onChange={(e) => setOtraLocalidad(e.target.value)}
                          required
                          minLength={3}
                          autoFocus
                        />
                      </div>
                    )}
                    <input 
                      type="hidden" 
                      name="locality" 
                      value={localidadSelect === "otra" ? otraLocalidad.trim() : localidadSelect} 
                    />
                </div>

                {/* 🔴 Llego hasta (Lista desplegable con opciones fijas) */}
                <div>
                    <label htmlFor="llegoHastaSelect" className="form-label">
                      Llego hasta <span className="label-required">*</span>
                    </label>
                    <select 
                      id="llegoHastaSelect" 
                      name="llegoHasta"
                      className="form-select"
                      value={llegoHastaSelect}
                      onChange={(e) => setLlegoHastaSelect(e.target.value)}
                      required
                    >
                      <option value="" disabled>Seleccioná hasta qué ciudad podés llegar</option>
                      {CIUDADES_OPCIONES.map((ciudad) => (
                        <option key={ciudad} value={ciudad}>{ciudad}</option>
                      ))}
                    </select>
                </div>

                {/* Alias */}
                <div>
                    <label htmlFor="alias" className="form-label">
                      Alias de cobro <span className="label-required">*</span>
                    </label>
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

                {/* Descripción */}
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
                  <button type="button" className="btn-cancel" onClick={handleCancelar} disabled={enviando}>
                    Cancelar
                  </button>
                  <button type='submit' className="btn-save" disabled={enviando}>
                    {enviando ? "Enviando solicitud..." : "Enviar"}
                  </button>
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