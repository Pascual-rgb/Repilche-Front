import { useState, useEffect } from "react";
import "./styles/MisListas.css";

export interface VentaItem {
  id: number | string;
  item_id?: number;
  pedido_id?: number;
  producto_nombre: string;
  precio: number;
  imagen: string;
  comprador_nombre: string;
  comprador_telefono?: string;
  estado_entrega: "en_custodia" | "ENTREGADO" | "entregado" | string;
}

interface BackendVentaItem {
  item_id?: number;
  id?: number | string;
  pedido_id?: number;
  nombre?: string;
  producto_nombre?: string;
  precio?: number;
  imagen?: string | null;
  comprador_nombre?: string;
  comprador_telefono?: string;
  estado_entrega?: string;
}

const MisVentas = () => {
  const [ventas, setVentas] = useState<VentaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [itemEnValidacion, setItemEnValidacion] = useState<number | string | null>(null);
  const [codigoInput, setCodigoInput] = useState<string>("");
  const [validando, setValidando] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

  // 1. Carga de Ventas (GET /api/mis-ventas/)
  useEffect(() => {
    let isMounted = true;

  const fetchVentas = async () => {
    setLoading(true);
    const token = localStorage.getItem("repilche-token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/mis-ventas/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const items: BackendVentaItem[] = Array.isArray(data)
          ? data
          : (data.results || []);

        const mapped: VentaItem[] = items.map((item, idx) => {
          const rawImg = item.imagen || "";
          const portada = rawImg
            ? rawImg.split(",")[0].trim()
            : "/src/data/img/remera-negra-manga-corta.png";

          return {
            id: item.item_id ?? item.id ?? idx,
            item_id: item.item_id,
            pedido_id: item.pedido_id,
            producto_nombre: item.nombre || item.producto_nombre || "Prenda vendida",
            precio: Number(item.precio || 0),
            imagen: portada,
            comprador_nombre: item.comprador_nombre || "Comprador",
            comprador_telefono: item.comprador_telefono,
            estado_entrega: item.estado_entrega || "en_custodia",
          };
        });

        if (isMounted) {
          setVentas(mapped);
        }
      } else {
        console.error("Error al obtener mis ventas. Status:", res.status);
      }
    } catch (err) {
      console.error("Error de red al cargar mis ventas:", err);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchVentas();

  return () => {
    isMounted = false;
  };
}, [apiUrl]);

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getCoverImage = (imagen: string): string => {
  if (!imagen) return "/src/data/img/remera-negra-manga-corta.png";
  const primera = imagen.split(",")[0]?.trim();
  return primera || "/src/data/img/remera-negra-manga-corta.png";
};

const handleAbrirValidacion = (itemId: number | string) => {
  setItemEnValidacion(itemId);
  setCodigoInput("");
  setErrorMsg(null);
  setSuccessMsg(null);
};

const handleCancelarValidacion = () => {
  if (validando) return;
  setItemEnValidacion(null);
  setCodigoInput("");
  setErrorMsg(null);
  setSuccessMsg(null);
};

// 2. Cierre de Custodia (POST /api/pedidos/validar-entrega/)
const handleValidarEntrega = async (itemId: string | number) => {
    const codigoLimpio = codigoInput.trim();
    if (codigoLimpio.length !== 6) {
      setErrorMsg("El código debe contener exactamente 6 dígitos numéricos.");
      return;
    }

    const token = localStorage.getItem("repilche-token");
    if (!token) {
      setErrorMsg("Debes iniciar sesión para confirmar la entrega.");
      return;
    }

    setValidando(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let res = await fetch(`${apiUrl}/pedidos/validar-entrega/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: itemId,
          codigo: codigoLimpio,
        }),
      });

      // Si la ruta alternativa estuviera activa
      if (res.status === 404) {
        res = await fetch(`${apiUrl}/ventas/${itemId}/confirmar-entrega/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            item_id: itemId,
            codigo: codigoLimpio,
          }),
        });
      }

      if (res.ok) {
        // Actualizar ítem local a "ENTREGADO"
        setVentas((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? { ...item, estado_entrega: "ENTREGADO" }
              : item
          )
        );

        setSuccessMsg("¡Entrega confirmada con éxito! Fondos liberados.");
        setCodigoInput("");

        setTimeout(() => {
          setItemEnValidacion(null);
          setSuccessMsg(null);
        }, 1500);
      } else {
        let errorServidor = "Código de retiro incorrecto";
        try {
          const errorData = await res.json();
          errorServidor =
            errorData.error ||
            errorData.detail ||
            errorData.message ||
            (typeof errorData === "string" ? errorData : "Código de retiro incorrecto");
        } catch {
          // fallback a mensaje por defecto
        }
        setErrorMsg(errorServidor);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { error?: string } }; message?: string };
      const mensaje =
        errorObj?.response?.data?.error ||
        errorObj?.message ||
        "Ocurrió un error al validar el código. Intentá nuevamente.";
      setErrorMsg(mensaje);
    } finally {
      setValidando(false);
    }
  };

  return (
    <main className="lista-page">
      <section className="lista-container">
        <h1 className="lista-title">Mis ventas</h1>
        <p className="lista-subtitle">
          Antes de entregar la prenda, pedile el código de retiro de 6 dígitos al comprador y validalo acá para liberar los fondos en custodia.
        </p>

        {loading ? (
          <div className="lista-vacia" style={{ padding: "50px 20px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid #eee",
                borderTop: "3px solid #f6ca17",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                marginBottom: "12px",
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ margin: 0, color: "#666", fontWeight: 500 }}>
              Cargando tus ventas...
            </p>
          </div>
        ) : ventas.length === 0 ? (
          <div className="lista-vacia">
            <div className="lista-vacia-icon">🏷️</div>
            <h2>Todavía no tenés ventas registradas</h2>
            <p>
              Cuando un comprador adquiera una de tus prendas, aparecerá acá para que confirmes la entrega.
            </p>
          </div>
        ) : (
          <div className="lista-grid">
            {ventas.map((venta) => {
              const estaEnValidacion = itemEnValidacion === venta.id;
              const estadoNorm = (venta.estado_entrega || "").toLowerCase();
              const esEntregado = estadoNorm === "entregado";
              const esCustodia = !esEntregado;

              return (
                <article key={venta.id} className="lista-card">
                  {/* Foto de la prenda vendida con primera imagen */}
                  <div className="lista-img">
                    <img
                      src={getCoverImage(venta.imagen)}
                      alt={venta.producto_nombre}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/src/data/img/remera-negra-manga-corta.png";
                      }}
                    />
                  </div>

                  <div className="lista-info">
                    {/* Encabezado con título y Badge visual de estado */}
                    <div className="lista-header-row">
                      <h2>{venta.producto_nombre}</h2>
                      {esCustodia ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#fff8e1",
                            color: "#b78103",
                            border: "1px solid #ffe082",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          ⏳ Pendiente de entrega
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            border: "1px solid #c8e6c9",
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✓ Entregado
                        </span>
                      )}
                    </div>

                    {/* Datos del comprador y precio formateado */}
                    <dl className="lista-datos">
                      <div>
                        <dt>Comprador</dt>
                        <dd style={{ fontSize: "16px" }}>{venta.comprador_nombre}</dd>
                      </div>
                      <div>
                        <dt>Precio</dt>
                        <dd>{formatPrice(venta.precio)}</dd>
                      </div>
                    </dl>

                    {/* Acciones según el estado de entrega */}
                    {!esCustodia ? (
                      <div className="estado-entregado" style={{ marginTop: "8px" }}>
                        Entrega confirmada y fondos liberados
                      </div>
                    ) : (
                      <div style={{ marginTop: "10px" }}>
                        {!estaEnValidacion ? (
                          <button
                            type="button"
                            className="lista-btn"
                            onClick={() => handleAbrirValidacion(venta.id)}
                          >
                            Confirmar Entrega
                          </button>
                        ) : (
                          /* Bloque interactivo de retiro con input de 6 dígitos */
                          <div
                            className="validar-box"
                            style={{
                              background: "#fbfbfb",
                              padding: "16px",
                              borderRadius: "14px",
                              border: "1px solid #ececec",
                            }}
                          >
                            <label htmlFor={`codigo-retiro-${venta.id}`}>
                              Código de retiro (6 dígitos numéricos)
                            </label>

                            <div className="validar-fila">
                              <input
                                id={`codigo-retiro-${venta.id}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="000000"
                                value={codigoInput}
                                onChange={(e) =>
                                  setCodigoInput(e.target.value.replace(/\D/g, ""))
                                }
                                disabled={validando}
                                autoFocus
                              />

                              <button
                                type="button"
                                className="lista-btn"
                                disabled={codigoInput.length !== 6 || validando}
                                onClick={() => handleValidarEntrega(venta.id)}
                              >
                                {validando ? "Validando..." : "Validar Código"}
                              </button>

                              <button
                                type="button"
                                onClick={handleCancelarValidacion}
                                disabled={validando}
                                style={{
                                  padding: "11px 18px",
                                  borderRadius: "10px",
                                  border: "1px solid #ddd",
                                  backgroundColor: "#fff",
                                  color: "#555",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                  cursor: validando ? "not-allowed" : "pointer",
                                  transition: "0.2s",
                                }}
                              >
                                Cancelar
                              </button>
                            </div>

                            {/* Mensajes de feedback contextual */}
                            {errorMsg && estaEnValidacion && (
                              <p className="validar-error">{errorMsg}</p>
                            )}
                            {successMsg && estaEnValidacion && (
                              <p
                                style={{
                                  margin: "8px 0 0",
                                  color: "#2e7d32",
                                  fontWeight: 600,
                                  fontSize: "14px",
                                }}
                              >
                                {successMsg}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default MisVentas;
