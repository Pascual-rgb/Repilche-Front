import { useRef } from 'react'
import type { FormEvent } from 'react'
import './styles/CargaProduct.css';

const CargaProduct = () => {
    const formRef = useRef<HTMLFormElement>(null)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formRef.current) return

        const data = new FormData(formRef.current)
        const usuario = Object.fromEntries(data)
        console.log(usuario)

        formRef.current.reset()

    }

    return (
        <>
            <div className="cargaProduct-page">
                <div className="cargaProduct-wrapper">
                    <div className='CargaProduct-header'>
                        <h1 className=''>Carga de Producto</h1>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className='cargaProduct-form'>
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
                            <button type='submit' className="btn-secondary">Guardar borrador</button>
                            <button type='submit' className="btn-secondary">Publicar y crear otra</button>
                            <button type='submit' className="btn-primary">Publicar prenda</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default CargaProduct