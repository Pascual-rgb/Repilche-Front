import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaShieldAlt, FaCheck, FaCopy, FaKey } from "react-icons/fa";
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
      // Ejecutar la confirmación/limpieza de carrito si existe
      if (onConfirmarTransferencia) {
        await onConfirmarTransferencia();
      }

      // Temporizador de 2.8 segundos (entre 2.5 y 3s) con spinner de verificación
      await new Promise((resolve) => setTimeout(resolve, 2800));

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
                  <span>Verificando transferencia...</span>
                </>
              ) : (
                "Ya transferí"
              )}
            </button>
          </>
        ) : (
          <>
            <div className="checkout-exito-icon" style={{ background: "#e8f5e9", color: "#2e7d32", margin: "10px auto 16px" }}>
              <FaCheck />
            </div>

            <div className="checkout-modal-header" style={{ textAlign: "center", marginBottom: "16px" }}>
              <h2>¡Pedido recibido con éxito!</h2>
              <p>Tu compra quedó registrada en estado de verificación y custodia segura.</p>
              {pedidoId && (
                <span style={{ fontSize: "13px", color: "#666", fontWeight: 600 }}>
                  Orden identificadora: #{pedidoId}
                </span>
              )}
            </div>

            {codigoSecreto && (
              <div
                className={`checkout-codigo-box ${codigoCopiado ? "copiado" : ""}`}
                onClick={handleCopyCodigo}
                title="Hacé click para copiar el código secreto"
                role="button"
                tabIndex={0}
                style={{
                  background: "#fdfae8",
                  border: "2px dashed #f6c417",
                  borderRadius: "14px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  margin: "16px 0",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#8c6b04", fontWeight: 700 }}>
                  <FaKey /> {codigoCopiado ? "¡Código copiado!" : "Código de seguridad para entrega (Click para copiar)"}
                </span>
                <strong style={{ display: "block", fontSize: "28px", letterSpacing: "4px", margin: "6px 0", color: "#1a1a1a", fontFamily: "'Viga', sans-serif" }}>
                  {codigoSecreto}
                </strong>
                <small style={{ display: "block", color: "#666", fontSize: "12px" }}>
                  Guardalo o consultalo luego en la sección <strong>Mis Compras</strong>.
                </small>
              </div>
            )}

            <div className="checkout-timeline">
              <div className="checkout-timeline-item">
                <div className="checkout-timeline-num">1</div>
                <div className="checkout-timeline-content">
                  <strong>Verificación:</strong> Nuestro equipo revisará el comprobante de acreditación de la transferencia.
                </div>
              </div>

              <div className="checkout-timeline-item">
                <div className="checkout-timeline-num">2</div>
                <div className="checkout-timeline-content">
                  <strong>Coordinación:</strong> Te contactaremos para coordinar el punto de encuentro con el vendedor.
                </div>
              </div>

              <div className="checkout-timeline-item">
                <div className="checkout-timeline-num">3</div>
                <div className="checkout-timeline-content">
                  <strong>Entrega protegida:</strong> En la sección <strong>Mis Compras</strong> vas a tener tu código de seguridad para mostrarle al vendedor al retirar la prenda.
                </div>
              </div>
            </div>

            <div className="checkout-exito-actions" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                className="checkout-btn-compras"
                onClick={handleIrAMisCompras}
              >
                Ir a Mis Compras
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
