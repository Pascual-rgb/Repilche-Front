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
  const [adquirido, setAdquirido] = useState<boolean>(false);
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

  const handleComprarClick = () => {
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

    setShowModalTransferencia(true);
  };

  // Callback de confirmación al pulsar "Ya transferí" en ModalPagoTransferencia
  const handleConfirmarPedido = async () => {
    const token = localStorage.getItem("repilche-token");
    const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

    const payload = {
      producto_id: producto.id,
      producto: producto.id,
      product_id: producto.id,
      product: producto.id,
    };

    let res = await fetch(`${apiUrl}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 404) {
      res = await fetch(`${apiUrl}/pedidos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      console.error("Error al registrar pedido en backend:", errData);
      let errorMsg = "No pudimos registrar tu compra en este momento.";
      if (errData) {
        if (typeof errData === "string") errorMsg = errData;
        else if (errData.error) errorMsg = errData.error;
        else if (errData.detail) errorMsg = errData.detail;
        else if (typeof errData === "object") {
          errorMsg = Object.entries(errData)
            .map(
              ([k, v]) =>
                `${k === "non_field_errors" ? "" : k + ": "}${
                  Array.isArray(v) ? v.join(", ") : v
                }`
            )
            .join(" | ");
        }
      }
      throw new Error(errorMsg);
    }

    // Pedido creado con éxito
    setAdquirido(true);
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
      <ModalPagoTransferencia
        isOpen={showModalTransferencia}
        onClose={() => setShowModalTransferencia(false)}
        monto={Number(producto.precio)}
        onConfirmarTransferencia={handleConfirmarPedido}
      />

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
                >
                  <FaBolt /> Comprar ahora
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