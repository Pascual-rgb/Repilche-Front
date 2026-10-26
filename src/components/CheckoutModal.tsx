import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaCheck, FaShieldAlt } from "react-icons/fa";
import "./styles/CheckoutModal.css";

export const ALIAS_OFICIAL = "REPILCHE.OFICIAL";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  onConfirmOrder: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  totalPrice,
  onConfirmOrder,
}: CheckoutModalProps) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Resetear al Paso 1 siempre que se abra el modal
  useEffect(() => {
    if (isOpen) {
      setPaso(1);
      setCopied(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setPaso(1);
    setCopied(false);
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
      await navigator.clipboard.writeText(ALIAS_OFICIAL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar alias al portapapeles:", err);
    }
  };

  const handleConfirmarTransferencia = () => {
    try {
      onConfirmOrder();
      setPaso(2);
    } catch (err) {
      console.error("Error al procesar la orden:", err);
      setError("No pudimos registrar tu pedido en este momento.");
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

  // Prevenir cierre accidental por click en el backdrop durante Paso 1
  const handleOverlayClick = () => {
    if (paso === 2) {
      handleClose();
    }
  };

  return (
    <div className="checkout-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="checkout-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
      >
        <button
          className="checkout-modal-close"
          onClick={handleClose}
          aria-label="Cerrar ventana de pago"
        >
          <FaTimes />
        </button>

        {paso === 1 ? (
          <>
            <div className="checkout-modal-header">
              <h2 id="checkout-modal-title">Completá tu transferencia</h2>
              <p>Tus fondos quedan protegidos por Repilche hasta que retires tu prenda mano a mano.</p>
            </div>

            <div className="checkout-monto-card">
              <span className="checkout-monto-label">Monto total a transferir</span>
              <div className="checkout-monto-valor">{formatPrice(totalPrice)}</div>
            </div>

            <div
              className={`checkout-alias-box ${copied ? "copiado" : ""}`}
              onClick={handleCopyAlias}
              title="Hacé click en cualquier lugar para copiar el Alias"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCopyAlias();
                }
              }}
            >
              <span className="checkout-alias-label">
                {copied ? "¡Alias copiado al portapapeles!" : "Alias oficial de custodia (Click para copiar)"}
              </span>
              <strong className="checkout-alias-text">{ALIAS_OFICIAL}</strong>
              <span className="checkout-alias-titular">
                Titular: Repilche Marketplace | Cuenta de Custodia Oficial
              </span>
            </div>

            <div className="checkout-escrow-badge">
              <FaShieldAlt />
              <div>
                <strong>Protección C2C Repilche:</strong> El dinero no se le entrega al vendedor hasta que te encuentres con él y le muestres tu código de seguridad tras revisar la prenda.
              </div>
            </div>

            {error && <div className="checkout-error">{error}</div>}

            <button
              type="button"
              className="checkout-confirm-btn"
              onClick={handleConfirmarTransferencia}
            >
              Ya realicé la transferencia
            </button>
          </>
        ) : (
          <>
            <div className="checkout-exito-icon">
              <FaCheck />
            </div>

            <div className="checkout-modal-header">
              <h2 id="checkout-modal-title">¡Pedido recibido con éxito!</h2>
              <p>Tu compra quedó registrada en estado de verificación.</p>
            </div>

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
                  <strong>Coordinación:</strong> Te contactaremos para coordinar el grupo de encuentro con el vendedor.
                </div>
              </div>

              <div className="checkout-timeline-item">
                <div className="checkout-timeline-num">3</div>
                <div className="checkout-timeline-content">
                  <strong>Entrega protegida:</strong> En la sección <strong>Mis Compras</strong> vas a tener tu código de seguridad de 6 dígitos para mostrarle al vendedor al retirar la prenda.
                </div>
              </div>
            </div>

            <div className="checkout-exito-actions">
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
