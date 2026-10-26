import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { FaCheck } from 'react-icons/fa'
import FeedbackCard from './FeedbackCard';
import './styles/CargaProduct.css';

type ModalTipo = 'publicar' | 'borrador' | null;

const CargaProduct = () => {
    const [modalTipo, setModalTipo] = useState<ModalTipo>(null)
    const [toastCrearOtra, setToastCrearOtra] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)

    const procesarEnvio = (tipo: 'publicar' | 'crear_otra' | 'borrador') => {
        if (!formRef.current) return

        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity()
            return
        }

        const data = new FormData(formRef.current)
        const prenda = Object.fromEntries(data)
        console.log(`Acción: ${tipo}`, prenda)

        formRef.current.reset()
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })

        if (tipo === 'crear_otra') {
            setModalTipo(null)
            setToastCrearOtra(true)
            setTimeout(() => setToastCrearOtra(false), 3500)
        } else if (tipo === 'borrador') {
            setToastCrearOtra(false)
            setModalTipo('borrador')
        } else {
            setToastCrearOtra(false)
            setModalTipo('publicar')
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        procesarEnvio('publicar')
    }

    return (
        <>
            <div className="cargaProduct-page">
                <div className="cargaProduct-wrapper">
                    <div className='CargaProduct-header'>
                        <h1 className=''>Carga de Producto</h1>
                    </div>

                    {modalTipo === 'publicar' && (
                        <FeedbackCard
                            icon={<FaCheck />}
                            title="¡Prenda enviada a revisión!"
                            message="Tu prenda fue cargada con éxito y está pendiente de moderación para ser publicada en el catálogo."
                            actionText="Publicar otra prenda"
                            onAction={() => {
                                setModalTipo(null)
                                window.scrollTo({ top: 0, left: 0, behavior: "instant" })
                            }}
                            secondaryActionText="Ir a Mis Productos"
                            secondaryActionTo="/mis-productos"
                        />
                    )}

                    {modalTipo === 'borrador' && (
                        <FeedbackCard
                            icon={<FaCheck />}
                            title="¡Borrador guardado con éxito!"
                            message="Tu prenda fue guardada como borrador. Podés editarla y publicarla cuando quieras desde Mis Productos."
                            actionText="Publicar otra prenda"
                            onAction={() => {
                                setModalTipo(null)
                                window.scrollTo({ top: 0, left: 0, behavior: "instant" })
                            }}
                            secondaryActionText="Ir a Mis Productos"
                            secondaryActionTo="/mis-productos"
                        />
                    )}

                    {!modalTipo && (
                    <form ref={formRef} onSubmit={handleSubmit} className='cargaProduct-form'>
                        {toastCrearOtra && (
                            <div className="cargaProduct-toast">
                                <FaCheck /> ¡Prenda enviada a revisión! El formulario quedó listo para cargar otra.
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="form-label mt-4">Nombre de la prenda</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="name" 
                                placeholder="Ej: Remera oversize vintage, Jean clásico..." 
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="form-label mt-4">Precio</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="price" 
                                placeholder="Ej: 15000"
                                min="0"
                                step="1"
                                onKeyDown={(e) => {
                                    if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }} 
                            />
                        </div>
                        <div>
                            <label htmlFor="categoria" className="form-label mt-4">Categoria</label>
                            <select className="form-select" id="categoria" defaultValue="" required>
                                <option value="" disabled>Seleccioná una categoría</option>
                                <option value="Pantalones">Pantalones</option>
                                <option value="Remeras">Remeras</option>
                                <option value="Calzado">Calzado</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Abrigo">Abrigo</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="descripcion" className="form-label mt-4">Descripcion</label>
                            <textarea 
                                className="form-control" 
                                id="descripcion" 
                                rows={3} 
                                placeholder="Ej: Talle M. Medidas: 52cm sisa x 70cm largo. Estado: Impecable, sin roturas ni manchas."
                            />
                            <small className="form-help-text">Detallá el talle real, medidas aproximadas y estado o detalles de uso de la prenda.</small>
                        </div>
                        <div>
                            <label htmlFor="formFile" className="form-label mt-4">Cargar fotos de la prenda</label>
                            <input className="form-control" type="file" id="formFile" />
                        </div>

                        <div className="cargaProduct-buttons">
                            <button 
                                type='button' 
                                className="btn-secondary"
                                onClick={() => procesarEnvio('borrador')}
                            >
                                Guardar borrador
                            </button>
                            <button 
                                type='button' 
                                className="btn-secondary"
                                onClick={() => procesarEnvio('crear_otra')}
                            >
                                Publicar y crear otra
                            </button>
                            <button 
                                type='submit' 
                                className="btn-primary"
                                onClick={() => procesarEnvio('publicar')}
                            >
                                Publicar prenda
                            </button>
                        </div>
                    </form>
                    )}
                </div>
            </div>
        </>
    )
}
export default CargaProduct