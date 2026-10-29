import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaUser,
  FaCheck,
  FaExclamationTriangle,
  FaBolt,
  FaShieldAlt,
} from "react-icons/fa";
import { productos, type Products } from "../data/products";
import { useCarritoContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import ModalPagoTransferencia from "./ModalPagoTransferencia";
import "./styles/ProductoDetail.css";

type ExtendedProduct = Products & {
  vendedor_id?: number;
  estado?: string;
};

const ProductoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCarritoContext();
  const { isLoggedIn, user } = useAuthContext();

  const localProducto = productos.find((p) => p.id === Number(id));
  const [producto, setProducto] = useState<ExtendedProduct | null>(localProducto || null);
  const [loading, setLoading] = useState<boolean>(!localProducto);

  // Estados de flujo de compra C2C
  const [showModalTransferencia, setShowModalTransferencia] = useState<boolean>(false);
  const [adquirido, setAdquirido] = useState<boolean>(() => {
    try {
      const comprados = JSON.parse(localStorage.getItem("repilche-compras-ids") || "[]");
      return comprados.includes(Number(id));
    } catch {
      return false;
    }
  });
  const [isCreandoOrden, setIsCreandoOrden] = useState<boolean>(false);
  const [datosCheckout, setDatosCheckout] = useState<{
    pedidoId?: number | string;
    total: number;
    codigoSecreto?: string;
    alias: string;
    titular: string;
  } | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  // Auto-cierre de toasts informativos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Carga de producto desde el backend
  useEffect(() => {
    let isMounted = true;
    const fetchProducto = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";
        const res = await fetch(`${apiUrl}/products/${id}/`);
        if (res.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item: any = await res.json();
          if (isMounted && item) {
            console.log("Datos del producto recibido:", item);
            const itemImg =
              item.imagen_url ||
              item.imagen ||
              item.image ||
              item.img ||
              "/src/data/img/remera-negra-manga-corta.png";

            setProducto({
              id: item.id,
              name: item.name || item.nombre || "Prenda sin nombre",
              descrp: item.descrp || item.descripcion || item.description || "Sin descripción disponible",
              img: itemImg,
              stock: Number(item.stock ?? 1),
              cat: Array.isArray(item.cat)
                ? item.cat
                : item.categoria_detail?.nombre
                ? [item.categoria_detail.nombre]
                : typeof item.categoria === "string"
                ? [item.categoria]
                : ["General"],
              precio: Number(item.precio || item.price || 0),
              vendedor:
                typeof item.vendedor === "string"
                  ? item.vendedor
                  : item.vendedor?.first_name
                  ? `${item.vendedor.first_name} ${item.vendedor.last_name || ""}`.trim()
                  : item.vendedor_nombre || "Repilche",
              vendedor_id:
                item.vendedor_id ??
                (typeof item.vendedor === "number"
                  ? item.vendedor
                  : item.vendedor?.id),
              estado: item.estado,
            });
          }
        }
      } catch (err) {
        console.warn("No se pudo obtener el producto del backend:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducto();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="producto-detail-page">
        <div style={{ textAlign: "center", padding: "40px" }}>Cargando producto...</div>
      </main>
    );
  }

  if (!producto) {
    return (
      <main className="producto-detail-page">
        <div className="producto-no-encontrado">
          <h1>Producto no encontrado</h1>
          <p>El producto que estás buscando no existe.</p>

          <Link to="/" className="volver-btn">
            <FaArrowLeft />
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProduct = producto as any;
  const placeholder = "/src/data/img/remera-negra-manga-corta.png";
  const imagen =
    rawProduct.imagen_url ||
    rawProduct.imagen ||
    rawProduct.image ||
    rawProduct.img ||
    producto.img ||
    placeholder;

  // Validaciones de negocio: dueño y disponibilidad
  const currentUserId = user?.id;
  const vendedorId =
    producto.vendedor_id ??
    (typeof rawProduct.vendedor === "number"
      ? rawProduct.vendedor
      : rawProduct.vendedor?.id);

  const esDuenio = Boolean(
    currentUserId && vendedorId && Number(currentUserId) === Number(vendedorId)
  );

  const noDisponible = Boolean(
    (producto.stock !== undefined && Number(producto.stock) <= 0) ||
    (rawProduct.estado &&
      !["DISPONIBLE", "disponible", "aprobado", "APROBADO"].includes(
        String(rawProduct.estado)
      ))
  );

  const handleComprarClick = async () => {
    const token = localStorage.getItem("repilche-token");
    if (!isLoggedIn || !token) {
      setToast({
        type: "warning",
        title: "Iniciá sesión para comprar",
        message: "Redirigiendo al inicio de sesión...",
      });
      setTimeout(() => navigate("/login"), 1600);
      return;
    }

    if (esDuenio) {
      setToast({
        type: "warning",
        title: "Esta prenda te pertenece",
        message: "No podés adquirir un producto publicado por tu propia cuenta.",
      });
      return;
    }

    if (noDisponible) {
      setToast({
        type: "error",
        title: "Vendido / No disponible",
        message: "Esta prenda ya no está disponible para la compra.",
      });
      return;
    }

    setIsCreandoOrden(true);
    const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

    const payload = {
      producto_id: producto.id,
      producto: producto.id,
      product_id: producto.id,
      product: producto.id,
    };

    try {
      // 1. Llamada prioritaria a POST /api/pedidos/
      let res = await fetch(`${apiUrl}/pedidos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Fallback si la ruta configurada en el backend fuera /orders/
      if (res.status === 404) {
        res = await fetch(`${apiUrl}/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

      if (!res.ok) {
        console.error("Error al registrar pedido en backend:", resData);
        let errorMsg = "No pudimos registrar tu compra en este momento.";
        if (resData) {
          if (typeof resData === "string") errorMsg = resData;
          else if (resData.error) errorMsg = resData.error;
          else if (resData.detail) errorMsg = resData.detail;
          else if (typeof resData === "object") {
            errorMsg = Object.entries(resData)
              .map(
                ([k, v]) =>
                  `${k === "non_field_errors" ? "" : k + ": "}${
                    Array.isArray(v) ? v.join(", ") : v
                  }`
              )
              .join(" | ");
          }
        }
        setToast({
          type: "error",
          title: "Error al generar la orden",
          message: errorMsg,
        });
        return;
      }

      // 2. Captura y normalización del contrato de respuesta Django
      const pedidoId = resData?.pedido_id ?? resData?.id;
      const total = Number(resData?.total ?? resData?.monto ?? producto.precio);
      const codigoSecreto = resData?.codigo_secreto ?? resData?.codigo ?? resData?.codigo_retiro;
      const aliasTransferencia = resData?.alias_transferencia || "repilche.oficial.mp";
      const titular = resData?.titular || "Repilche Moda Circular";

      setDatosCheckout({
        pedidoId,
        total,
        codigoSecreto,
        alias: aliasTransferencia,
        titular,
      });

      setShowModalTransferencia(true);
    } catch (err: unknown) {
      console.error("Fallo de conexión al generar pedido:", err);
      // Respaldo de contingencia offline/mock si hay error de red en desarrollo
      const codigoFallback = String(Math.floor(100000 + Math.random() * 900000));
      setDatosCheckout({
        pedidoId: Date.now(),
        total: Number(producto.precio),
        codigoSecreto: codigoFallback,
        alias: "repilche.oficial.mp",
        titular: "Repilche Moda Circular",
      });
      setShowModalTransferencia(true);
    } finally {
      setIsCreandoOrden(false);
    }
  };

  // Callback de confirmación al pulsar "Ya transferí" en ModalPagoTransferencia
  const handleConfirmarTransferencia = () => {
    // Pedido confirmado y prenda adquirida
    setAdquirido(true);

    try {
      // Persistir ID para mantener la prenda como adquirida si el usuario regresa
      const comprasIds = JSON.parse(localStorage.getItem("repilche-compras-ids") || "[]");
      if (!comprasIds.includes(producto.id)) {
        comprasIds.push(producto.id);
        localStorage.setItem("repilche-compras-ids", JSON.stringify(comprasIds));
      }

      // Persistir en pedidos locales para Mis Compras
      const pedidosGuardados = JSON.parse(localStorage.getItem("repilche-pedidos") || "[]");
      const nuevoPedido = {
        id: datosCheckout?.pedidoId || Date.now(),
        producto: {
          id: producto.id,
          name: producto.name,
          descrp: producto.descrp,
          precio: datosCheckout?.total || producto.precio,
          img: imagen,
          stock: 0,
          cat: producto.cat,
          vendedor: producto.vendedor,
        },
        comprador: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : (user?.username || "Comprador"),
        vendedor: producto.vendedor,
        telefonoVendedor: "280 4123456",
        codigo: datosCheckout?.codigoSecreto || "654321",
        estado: "pendiente",
      };
      pedidosGuardados.unshift(nuevoPedido);
      localStorage.setItem("repilche-pedidos", JSON.stringify(pedidosGuardados));
    } catch (err) {
      console.warn("No se pudo persistir en localStorage:", err);
    }
  };

  return (
    <main className="producto-detail-page">
      {/* Toast informativo flotante */}
      {toast && (
        <div className={`producto-detail-toast ${toast.type}`} role="alert">
          <div className="producto-detail-toast-icon">
            {toast.type === "success" && <FaCheck />}
            {toast.type === "error" && <FaExclamationTriangle />}
            {toast.type === "warning" && <FaExclamationTriangle />}
          </div>
          <div className="producto-detail-toast-body">
            <h4>{toast.title}</h4>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {/* Modal unificado de pago por transferencia C2C */}
      {datosCheckout && (
        <ModalPagoTransferencia
          isOpen={showModalTransferencia}
          onClose={() => setShowModalTransferencia(false)}
          monto={datosCheckout.total}
          alias={datosCheckout.alias}
          titular={datosCheckout.titular}
          codigoSecreto={datosCheckout.codigoSecreto}
          pedidoId={datosCheckout.pedidoId}
          onConfirmarTransferencia={handleConfirmarTransferencia}
        />
      )}

      <section className="producto-detail-container">
        <Link to="/" className="volver-btn">
          <FaArrowLeft />
          Volver a productos
        </Link>

        <div className="producto-detail">
          <div className="producto-detail-image">
            <img
              src={imagen}
              alt={producto.name as string}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("remera-negra-manga-corta.png")) {
                  target.src = placeholder;
                }
              }}
            />
          </div>

          <div className="producto-detail-info">
            <span className="producto-detail-category">
              {producto.cat.join(", ")}
            </span>

            <h1>{producto.name}</h1>

            <p className="producto-detail-description">{producto.descrp}</p>

            <div className="producto-detail-price">${producto.precio}</div>

            <div className="producto-detail-stock">
              Stock disponible: <strong>{producto.stock}</strong>
            </div>

            <div className="producto-detail-seller">
              <FaUser />
              <div>
                <span>Vendedor</span>
                <strong>{producto.vendedor}</strong>
              </div>
            </div>

            {/* Acciones de compra directa y carrito */}
            <div className="producto-detail-actions">
              {esDuenio ? (
                <button
                  type="button"
                  className="producto-detail-btn-disabled"
                  disabled
                  title="No podés comprar un producto que vos mismo publicaste"
                >
                  <FaShieldAlt /> Esta prenda te pertenece
                </button>
              ) : noDisponible ? (
                <button
                  type="button"
                  className="producto-detail-btn-disabled"
                  disabled
                >
                  Vendido / No disponible
                </button>
              ) : adquirido ? (
                <button
                  type="button"
                  className="producto-detail-btn-adquirido"
                  disabled
                >
                  <FaCheck /> ¡Adquirido!
                </button>
              ) : (
                <button
                  type="button"
                  className="producto-detail-comprar"
                  onClick={handleComprarClick}
                  disabled={isCreandoOrden}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {isCreandoOrden ? (
                    <>
                      <div className="checkout-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                      <span>Generando orden...</span>
                    </>
                  ) : (
                    <>
                      <FaBolt /> Comprar ahora
                    </>
                  )}
                </button>
              )}

              {!esDuenio && !noDisponible && !adquirido && (
                <button
                  type="button"
                  className="producto-detail-cart"
                  onClick={() => {
                    addToCart(producto, 1);
                    openCart();
                  }}
                >
                  <FaShoppingCart /> Agregar al carrito
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductoDetail;