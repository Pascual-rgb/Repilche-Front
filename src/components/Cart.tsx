import { useState } from "react";
import { useCarritoContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import { FaTimes, FaTrash } from "react-icons/fa";
import ModalPagoTransferencia from "./ModalPagoTransferencia";
import "./styles/Cart.css";

export default function Cart() {
  const { carrito, removeItem, getTotalPrice, isCartOpen, closeCart, emptyCart } = useCarritoContext();
  const { user } = useAuthContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreandoOrden, setIsCreandoOrden] = useState(false);
  const [datosCheckout, setDatosCheckout] = useState<{
    pedidoId?: number | string;
    total: number;
    codigoSecreto?: string;
    alias: string;
    titular: string;
  } | null>(null);

  const handleProcederPago = async () => {
    if (carrito.length === 0) return;
    setIsCreandoOrden(true);

    const token = localStorage.getItem("repilche-token");
    const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";
    const totalLocal = getTotalPrice();

    const payload = {
      items: carrito.map((item) => ({
        producto_id: item.id,
        producto: item.id,
        cantidad: item.quantity,
        precio: item.precio,
      })),
      total: totalLocal,
    };

    try {
      let res = await fetch(`${apiUrl}/pedidos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 404) {
        res = await fetch(`${apiUrl}/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let resData: any = null;
      try {
        resData = await res.json();
      } catch {
        resData = null;
      }

      // Captura de propiedades devueltas por Django según contrato
      const pedidoId = resData?.pedido_id ?? resData?.id;
      const total = Number(resData?.total ?? resData?.monto ?? totalLocal);
      const codigoSecreto = resData?.codigo_secreto ?? resData?.codigo ?? String(Math.floor(100000 + Math.random() * 900000));
      const alias = resData?.alias_transferencia || "repilche";
      const titular = resData?.titular || "Maia Hernandez";

      setDatosCheckout({
        pedidoId,
        total,
        codigoSecreto,
        alias,
        titular,
      });

      closeCart();
      setIsCheckoutOpen(true);
    } catch (err) {
      console.warn("Conexión con backend falló, usando contingencia de orden:", err);
      // Contingencia local si no hay conexión
      setDatosCheckout({
        pedidoId: Date.now(),
        total: totalLocal,
        codigoSecreto: String(Math.floor(100000 + Math.random() * 900000)),
        alias: "repilche",
        titular: "Maia Hernandez",
      });
      closeCart();
      setIsCheckoutOpen(true);
    } finally {
      setIsCreandoOrden(false);
    }
  };

  const handleConfirmarPedido = () => {
    try {
      // 1. Guardar IDs de prendas compradas para que queden adquiridas si se visita el detalle
      const comprados = JSON.parse(localStorage.getItem("repilche-compras-ids") || "[]");
      carrito.forEach((item) => {
        if (!comprados.includes(item.id)) comprados.push(item.id);
      });
      localStorage.setItem("repilche-compras-ids", JSON.stringify(comprados));

      // 2. Guardar pedidos en localStorage para que aparezcan en Mis Compras
      const pedidosGuardados = JSON.parse(localStorage.getItem("repilche-pedidos") || "[]");
      carrito.forEach((item, index) => {
        pedidosGuardados.unshift({
          id: Number(datosCheckout?.pedidoId || Date.now()) + index,
          producto: {
            id: item.id,
            name: item.name,
            descrp: "Prenda adquirida a través del carrito",
            precio: item.precio,
            img: item.img,
            stock: 0,
            cat: ["Carrito"],
            vendedor: "Repilche Moda Circular",
          },
          comprador: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : (user?.username || "Comprador"),
          vendedor: "Repilche Moda Circular",
          telefonoVendedor: "280 4123456",
          codigo: datosCheckout?.codigoSecreto || "654321",
          estado: "pendiente",
        });
      });
      localStorage.setItem("repilche-pedidos", JSON.stringify(pedidosGuardados));
    } catch (e) {
      console.warn("Error al persistir pedidos de carrito:", e);
    }

    // 3. Vaciar carrito de inmediato tras tocar 'Ya transferí'
    emptyCart();
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setDatosCheckout(null);
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
                disabled={carrito.length === 0 || isCreandoOrden}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                {isCreandoOrden ? (
                  <>
                    <div className="checkout-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                    <span>Iniciando pago...</span>
                  </>
                ) : (
                  "Finalizar Compra"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && datosCheckout && (
        <ModalPagoTransferencia
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          monto={datosCheckout.total}
          alias={datosCheckout.alias}
          titular={datosCheckout.titular}
          codigoSecreto={datosCheckout.codigoSecreto}
          pedidoId={datosCheckout.pedidoId}
          onConfirmarTransferencia={handleConfirmarPedido}
        />
      )}
    </>
  );
}