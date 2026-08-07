import { useRef } from 'react'
import type { FormEvent } from 'react'

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
        <>
        <div className='SerVendedor-header'>
            <h1 className=''>Ser vendedor</h1>
        </div>

        <form ref = {formRef} onSubmit={handleSubmit} className='serVendedor-form'>
            <div>
                <label htmlFor="name" className="form-label mt-4">Localidad</label>
                <input type="text" className="form-control" id="name" placeholder="Localidad" />
            </div>
            <div>
                <label htmlFor="lastName" className="form-label mt-4">LlegoHasta</label>
                <input type="text" className="form-control" id="lastName" placeholder="Llego hasta...(localidades)" />
            </div>
            <div>
                <label htmlFor="cvu" className="form-label mt-4">CVU</label>
                <input type="text" className="form-control" id="cvu" placeholder="CVU(CBU)" />
            </div>
            <div>
                <label htmlFor="exampleTextarea" className="form-label mt-4">Description</label>
                <textarea className="form-control" id="exampleTextarea" rows={3} style={{ 'height': '37px' }} />
            </div>

            <button type='submit'>Enviar</button>
        </form>
        </>
)
}
export default SerVendedorForm