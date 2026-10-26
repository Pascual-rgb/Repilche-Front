import { useState } from "react";
import { useCarritoContext } from "../context/CartContext";
import { FaTimes, FaTrash } from "react-icons/fa";
import CheckoutModal from "./CheckoutModal";
import "./styles/Cart.css";

export default function Cart() {
  const { carrito, removeItem, getTotalPrice, isCartOpen, closeCart, emptyCart } = useCarritoContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  const handleProcederPago = () => {
    if (carrito.length === 0) return;
    setCheckoutTotal(getTotalPrice());
    closeCart();
    setIsCheckoutOpen(true);
  };

  const handleConfirmarPedido = () => {
    // Vaciar carrito de inmediato al confirmar la transferencia
    emptyCart();
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutTotal(0);
  };

  return (
    <>
      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Tu Carrito</h2>
              <button className="close-btn" onClick={closeCart}>
                <FaTimes />
              </button>
            </div>

            <div className="cart-items">
              {carrito.length === 0 ? (
                <p className="empty-cart">Tu carrito está vacío</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.img as string} alt={item.name as string} />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p>${item.precio} x {item.quantity}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <strong>${getTotalPrice()}</strong>
              </div>
              <button 
                className="checkout-btn" 
                onClick={handleProcederPago}
                disabled={carrito.length === 0}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          totalPrice={checkoutTotal}
          onConfirmOrder={handleConfirmarPedido}
        />
      )}
    </>
  );
}