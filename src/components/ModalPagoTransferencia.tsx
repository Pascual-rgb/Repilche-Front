import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaShieldAlt, FaCheck, FaCopy, FaKey } from "react-icons/fa";
import { useCarritoContext } from "../context/CartContext";
import "./styles/CheckoutModal.css";

export const ALIAS_OFICIAL = "repilche.oficial.mp";
export const TITULAR_OFICIAL = "Repilche Moda Circular";

export interface ModalPagoTransferenciaProps {
  isOpen: boolean;
  onClose: () => void;
  monto: number;
  alias?: string;
  titular?: string;
  codigoSecreto?: string;
  pedidoId?: number | string;
  onConfirmarTransferencia?: () => Promise<void> | void;
}

export default function ModalPagoTransferencia({
  isOpen,
  onClose,
  monto,
  alias = ALIAS_OFICIAL,
  titular = TITULAR_OFICIAL,
  codigoSecreto,
  pedidoId,
  onConfirmarTransferencia,
}: ModalPagoTransferenciaProps) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [copiado, setCopiado] = useState(false);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { emptyCart } = useCarritoContext();

  // Resetear estados al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setPaso(1);
      setCopiado(false);
      setCodigoCopiado(false);
      setIsSubmitting(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setPaso(1);
    setCopiado(false);
    setCodigoCopiado(false);
    setError(null);
    onClose();
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopyAlias = async () => {
    try {
      await navigator.clipboard.writeText(alias);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch (err) {
      console.error("Error al copiar alias al portapapeles:", err);
    }
  };

  const handleCopyCodigo = async () => {
    if (!codigoSecreto) return;
    try {
      await navigator.clipboard.writeText(codigoSecreto);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2200);
    } catch (err) {
      console.error("Error al copiar código al portapapeles:", err);
    }
  };

  const handleConfirmar = async () => {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Ejecutar callback previo si existe
      if (onConfirmarTransferencia) {
        await onConfirmarTransferencia();
      }

      // 2. Simula la espera con timer de 2.5 a 3 segundos (2800ms) mostrando "Verificando comprobante con la red bancaria..."
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 3. Cambiar a estado de éxito con fondos en custodia
      setPaso(2);
    } catch (err: unknown) {
      console.error("Error al confirmar transferencia:", err);
      const msg = err instanceof Error ? err.message : "No pudimos procesar tu solicitud en este momento.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIrAMisCompras = () => {
    // 5. Limpia el carrito si la compra provino de allí y redirige a /mis-compras
    try {
      emptyCart();
    } catch (err) {
      console.warn("Error vaciando carrito al ir a Mis Compras:", err);
    }
    handleClose();
    navigate("/mis-compras");
  };

  const handleSeguirExplorando = () => {
    handleClose();
    navigate("/products");
  };

  return (
    <div
      className="checkout-modal-overlay"
      onClick={() => {
        if (!isSubmitting) handleClose();
      }}
    >
      <div
        className="checkout-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transferencia-modal-title"
      >
        <button
          className="checkout-modal-close"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Cerrar modal"
        >
          <FaTimes />
        </button>

        {paso === 1 ? (
          <>
            <div className="checkout-modal-header">
              <h2 id="transferencia-modal-title">Completá tu transferencia</h2>
              <p>Tus fondos quedan protegidos por Repilche hasta que retires tu prenda mano a mano.</p>
              {pedidoId && (
                <small style={{ display: "block", marginTop: "4px", color: "#888", fontSize: "12px" }}>
                  Orden #{pedidoId}
                </small>
              )}
            </div>

            <div className="checkout-monto-card">
              <span className="checkout-monto-label">Monto total a transferir</span>
              <div className="checkout-monto-valor">{formatPrice(monto)}</div>
            </div>

            <div
              className={`checkout-alias-box ${copiado ? "copiado" : ""}`}
              onClick={handleCopyAlias}
              title="Hacé click para copiar el Alias"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCopyAlias();
                }
              }}
            >
              <span className="checkout-alias-label" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <FaCopy /> {copiado ? "¡Alias copiado al portapapeles!" : "Alias oficial de custodia (Click para copiar)"}
              </span>
              <strong className="checkout-alias-text">{alias}</strong>
              <span className="checkout-alias-titular">
                Titular: {titular}
              </span>
            </div>

            <div className="checkout-escrow-badge">
              <FaShieldAlt />
              <div>
                <strong>Protección C2C Repilche:</strong> El dinero permanece en custodia y no se le entrega al vendedor hasta que te encuentres con él y le muestres tu código de seguridad tras revisar la prenda.
              </div>
            </div>

            {error && (
              <div
                className="checkout-error"
                style={{
                  margin: "14px 0",
                  color: "#dc2626",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="button"
              className="checkout-confirm-btn"
              onClick={handleConfirmar}
              disabled={isSubmitting}
              style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "16px" }}
            >
              {isSubmitting ? (
                <>
                  <div className="checkout-spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }}></div>
                  <span>Verificando comprobante con la red bancaria...</span>
                </>
              ) : (
                "Ya transferí"
              )}
            </button>
          </>
        ) : (
          <>
            <div className="checkout-exito-icon" style={{ background: "#e8f5e9", color: "#2e7d32", margin: "8px auto 14px" }}>
              <FaCheck />
            </div>

            <div className="checkout-modal-header" style={{ textAlign: "center", marginBottom: "16px" }}>
              <h2>¡Transferencia registrada!</h2>
            </div>

            {codigoSecreto && (
              <div
                className={`checkout-codigo-box ${codigoCopiado ? "copiado" : ""}`}
                onClick={handleCopyCodigo}
                title="Hacé click para copiar el código secreto"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopyCodigo();
                  }
                }}
                style={{
                  background: codigoCopiado ? "#eef7ee" : "#fdfae8",
                  border: `2px dashed ${codigoCopiado ? "#2e7d32" : "#f6c417"}`,
                  borderRadius: "14px",
                  padding: "16px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  margin: "12px 0 18px",
                  transition: "all 0.2s ease",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: codigoCopiado ? "#2e7d32" : "#8c6b04",
                    fontWeight: 700,
                  }}
                >
                  <FaKey /> {codigoCopiado ? "¡Código copiado al portapapeles!" : "Código de retiro (Click para copiar)"}
                </span>
                <strong
                  style={{
                    display: "block",
                    fontSize: "34px",
                    letterSpacing: "6px",
                    margin: "6px 0 2px",
                    color: "#1a1a1a",
                    fontFamily: "'Viga', sans-serif",
                  }}
                >
                  {codigoSecreto}
                </strong>
              </div>
            )}

            <div className="checkout-timeline" style={{ margin: "14px 0 20px" }}>
              <div className="checkout-timeline-item">
                <div className="checkout-timeline-num">1</div>
                <div className="checkout-timeline-content">
                  <strong>Coordinación:</strong> Un moderador de Repilche creará un grupo entre el vendedor y vos para coordinar el punto y horario de entrega.
                </div>
              </div>

              <div className="checkout-timeline-item">
                <div className="checkout-timeline-num">2</div>
                <div className="checkout-timeline-content">
                  <strong>Entrega protegida:</strong> Mostrale este código de seguridad al vendedor recién cuando tengas la prenda en mano y confirmes su estado.
                </div>
              </div>
            </div>

            <div className="checkout-exito-actions" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                className="checkout-btn-compras"
                onClick={handleIrAMisCompras}
              >
                Ver Mis Compras
              </button>
              <button
                type="button"
                className="checkout-btn-seguir"
                onClick={handleSeguirExplorando}
              >
                Seguir explorando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
