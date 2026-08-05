import React from 'react'
import { useCarritoContext } from './CartContext' // Asegúrate de que la ruta sea correcta

export const Cart = () => {
  // Consumimos las funciones y estados globales que definimos en el Contexto
  const { carrito, removeItem, emptyCart, getTotalPrice } = useCarritoContext()

  // Paso 1: Si el carrito no tiene elementos, mostramos una alerta y evitamos renderizar el resto
  if (carrito.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-info py-5" role="alert">
          <h3 className="alert-heading mb-3">Tu carrito está vacío 🧺</h3>
          <p className="text-muted">¡Date una vuelta por la tienda para encontrar prendas únicas de segunda mano!</p>
          <hr />
          <button className="btn btn-primary mt-2">Volver a la tienda</button>
        </div>
      </div>
    )
  }

  // Paso 2: Si hay elementos, renderizamos la interfaz del carrito
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-dark border-bottom pb-2">Tu Carrito de Compras</h2>
      
      <div className="row">
        {/* Columna Izquierda: Lista de Productos (Ocupa 8 de 12 columnas en pantallas grandes) */}
        <div className="col-lg-8">
          {carrito.map((item) => (
            <div className="card mb-3 shadow-sm" key={item.id}>
              <div className="row g-0 align-items-center">
                
                {/* Imagen del producto */}
                <div className="col-md-2 text-center bg-light p-2">
                  {item.img ? (
                    <img src={String(item.img)} alt={item.name} className="img-fluid rounded" style={{ maxHeight: '80px' }} />
                  ) : (
                    <div className="text-muted" style={{ fontSize: '2rem' }}>👕</div>
                  )}
                </div>

                {/* Detalles de la prenda */}
                <div className="col-md-6">
                  <div className="card-body py-2">
                    <h5 className="card-title mb-1 text-capitalize">{item.name}</h5>
                    <p className="card-text text-muted small mb-0">{item.descrp}</p>
                    <small className="text-success">Vendedor: {item.vendedor}</small>
                  </div>
                </div>

                {/* Cantidad, Precios y Acciones */}
                <div className="col-md-4 text-end pe-4">
                  <div className="mb-1">
                    <span className="badge bg-secondary me-2">Cant: {item.quantity}</span>
                    <span className="fw-bold text-dark">${(item.precio * item.quantity).toLocaleString()}</span>
                  </div>
                  <small className="text-muted d-block mb-2">Precio unitario: ${item.precio}</small>
                  
                  {/* Botón para eliminar este item individualmente */}
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>

              </div>
            </div>
          ))}

          {/* Botón secundario para vaciar todo el carrito */}
          <button className="btn btn-outline-secondary btn-sm mt-2" onClick={emptyCart}>
            Vaciar Carrito 🗑️
          </button>
        </div>

        {/* Columna Derecha: Resumen de Compra (Ocupa 4 de 12 columnas) */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card bg-light shadow-sm border-0 position-sticky" style={{ top: '20px' }}>
            <div className="card-body">
              <h4 className="card-title mb-4 text-center">Resumen del Pedido</h4>
              
              <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                <span>Productos:</span>
                <span className="fw-semibold">{carrito.reduce((acc, p) => acc + p.quantity, 0)} prendas</span>
              </div>

              <div className="d-flex justify-content-between mb-4">
                <span className="h5">Total:</span>
                <span className="h4 text-primary fw-bold">${getTotalPrice().toLocaleString()}</span>
              </div>

              {/* Simulación de acciones de Checkout */}
              <button 
                className="btn btn-success w-100 py-2 fw-bold" 
                onClick={() => alert('¡Simulación de compra exitosa! Aquí conectarían con pasarela de pago o WhatsApp.')}
              >
                Finalizar Compra ✔️
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}