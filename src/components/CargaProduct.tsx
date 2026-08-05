import { useRef } from 'react'
import type { FormEvent } from 'react'

const CargaProduct = () => {
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
        <div className='CargaProduct-header'>
            <h1 className=''>Carga de Producto</h1>
        </div>

        <form ref = {formRef} onSubmit={handleSubmit} className='cargaProduct-form'>
            <div>
                <label htmlFor="name" className="form-label mt-4">NombrePrenda</label>
                <input type="text" className="form-control" id="name" placeholder="Nombre de la prenda..." />
            </div>
            <div>
                <label htmlFor="price" className="form-label mt-4">Precio</label>
                <input type="text" className="form-control" id="price" placeholder="Precio: $$$" />
            </div>
            <div>
                <label htmlFor="categoria" className="form-label mt-4">Categoría</label>
                <select className="form-select" id="categoria">
                <option>Pantalones</option>
                <option>Remeras</option>
                <option>Calzado</option>
                <option>Accesorios</option>
                <option>Abrigo</option>
                </select>
            </div>
            <div>
                <label htmlFor="exampleTextarea" className="form-label mt-4">Description</label>
                <textarea className="form-control" id="exampleTextarea" rows={3} style={{ 'height': '37px' }} />
            </div>
            <div>
                <label htmlFor="formFile" className="form-label mt-4">Cargar fotos de la prenda</label>
                <input className="form-control" type="file" id="formFile" />
            </div>
        
            <button type='submit'>Guardar y agregar otro</button>
            <button type='submit'>Guardar y seguir editando</button>
            <button type='submit'>Guardar</button>
        </form>
        
        </>
)
}
export default CargaProduct