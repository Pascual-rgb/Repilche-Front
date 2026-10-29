import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCopy, FaCheck, FaShieldAlt, FaShoppingBag } from "react-icons/fa";
import { pedidosMock } from "../data/PedidosEje";
import "./styles/MisListas.css";

export interface BackendItem {
  id?: number | string;
  nombre?: string;
  precio?: number | string;
  imagen?: string | null;
  vendedor_nombre?: string;
  codigo_secreto?: string;
  estado_entrega?: string;
  producto?: {
    nombre?: string;
    name?: string;
    precio?: number | string;
    imagen?: string;
    imagen_url?: string;
    img?: string;
    descrp?: string;
    descripcion?: string;
  };
  name?: string;
  vendedor?: string;
  codigo?: string;
  estado?: string;
  descrp?: string;
  descripcion?: string;
}

export interface BackendPedido {
  id?: number | string;
  pedido_id?: number | string;
  fecha?: string;
  created_at?: string;
  items?: BackendItem[];
  nombre?: string;
  precio?: number | string;
  imagen?: string | null;
  vendedor_nombre?: string;
  codigo_secreto?: string;
  estado_entrega?: string;
  total?: number | string;
}

export interface CompraItem {
  id: number | string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string;
  vendedor: string;
  codigoSecreto: string;
  estadoEntrega: string;
  fecha?: string;
}

const MisCompras = () => {
  const [compras, setCompras] = useState<CompraItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCompras = async () => {
      setLoading(true);
      const token = localStorage.getItem("repilche-token");
      const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

      // 1. Obtener compras guardadas localmente en la sesión
      const comprasLocales: CompraItem[] = (() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const guardados = JSON.parse(localStorage.getItem("repilche-pedidos") || "[]");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return guardados.map((g: any) => ({
            id: g.id,
            nombre: g.producto?.name || g.nombre || "Prenda adquirida",
            descripcion: g.producto?.descrp || g.descripcion || "",
            precio: Number(g.producto?.precio || g.total || 0),
            imagen:
              g.producto?.img ||
              g.producto?.imagen ||
              g.producto?.imagen_url ||
              "/src/data/img/remera-negra-manga-corta.png",
            vendedor: g.vendedor || "Repilche Moda Circular",
            codigoSecreto: g.codigo || g.codigo_secreto || "000000",
            estadoEntrega: g.estado || g.estado_entrega || "pendiente",
          }));
        } catch {
          return [];
        }
      })();

      // 2. Consulta a la API real GET /api/pedidos/ con JWT y soporte de paginación DRF
      let apiItems: CompraItem[] = [];
      if (token) {
        try {
          const res = await fetch(`${apiUrl}/pedidos/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await res.json();
            // Soporte robusto de paginación DRF: Array directo o data.results
            const listaPedidos: BackendPedido[] = Array.isArray(data)
              ? data
              : (data.results || []);

            // Mapeo exacto de los datos del Backend al Estado
            listaPedidos.forEach((pedido: BackendPedido, pIdx: number) => {
              const fechaPedido = pedido.fecha || pedido.created_at;
              const items = Array.isArray(pedido.items) && pedido.items.length > 0
                ? pedido.items
                : [pedido as BackendItem];

              items.forEach((item: BackendItem, iIdx: number) => {
                const rawImg =
                  item.imagen ||
                  item.producto?.imagen ||
                  item.producto?.imagen_url ||
                  item.producto?.img;

                const imagenFinal =
                  rawImg && typeof rawImg === "string" && rawImg.trim() !== ""
                    ? rawImg
                    : "/src/data/img/remera-negra-manga-corta.png";

                const nombre =
                  item.nombre ||
                  item.producto?.nombre ||
                  item.producto?.name ||
                  item.name ||
                  "Prenda adquirida";

                const precio = Number(
                  item.precio ??
                  item.producto?.precio ??
                  (pedido.total ?? 0)
                );

                const vendedor =
                  item.vendedor_nombre ||
                  (typeof item.vendedor === "string" ? item.vendedor : "Vendedor Repilche");

                const codigoSecreto = String(
                  item.codigo_secreto ||
                  item.codigo ||
                  pedido.codigo_secreto ||
                  "000000"
                );

                const estadoEntrega = String(
                  item.estado_entrega ||
                  item.estado ||
                  "pendiente"
                );

                apiItems.push({
                  id: item.id ?? pedido.id ?? `${pIdx}-${iIdx}`,
                  nombre,
                  descripcion: item.descripcion || item.producto?.descrp,
                  precio,
                  imagen: imagenFinal,
                  vendedor,
                  codigoSecreto,
                  estadoEntrega,
                  fecha: fechaPedido,
                });
              });
            });
          }
        } catch (err) {
          console.warn("No se pudo obtener pedidos de la API, usando datos locales:", err);
        }
      }

      // 3. Unificar evitando duplicados por ID
      const unificadas = [...comprasLocales];
      apiItems.forEach((apiItem) => {
        if (!unificadas.some((u) => String(u.id) === String(apiItem.id))) {
          unificadas.push(apiItem);
        }
      });

      // Respaldo de ejemplo si no hay compras ni token
      if (unificadas.length === 0 && (!token || token === "mock-token")) {
        pedidosMock.forEach((m) => {
          unificadas.push({
            id: m.id,
            nombre: m.producto.name,
            descripcion: m.producto.descrp,
            precio: Number(m.producto.precio),
            imagen: m.producto.img as string,
            vendedor: m.vendedor,
            codigoSecreto: m.codigo,
            estadoEntrega: m.estado,
          });
        });
      }

      if (isMounted) {
        setCompras(unificadas);
        setLoading(false);
      }
    };

    fetchCompras();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = async (codigo: string, id: number | string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2200);
    } catch (err) {
      console.error("Error al copiar el código:", err);
    }
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="lista-page">
      <section className="lista-container">
        <h1 className="lista-title">Mis compras</h1>
        <p className="lista-subtitle">
          Tus fondos están seguros en custodia. Mostrale el código al vendedor al retirar la prenda.
        </p>

        {loading ? (
          <div className="lista-vacia" style={{ padding: "40px" }}>
            <p>Cargando tus compras...</p>
          </div>
        ) : compras.length === 0 ? (
          <div className="lista-vacia">
            <div className="lista-vacia-icon">
              <FaShoppingBag />
            </div>
            <h2>Todavía no hiciste ninguna compra</h2>
            <p>Descubrí prendas únicas de moda circular en nuestro catálogo oficial.</p>
            <Link to="/" className="lista-btn">
              Explorar prendas
            </Link>
          </div>
        ) : (
          <div className="lista-grid">
            {compras.map((c) => {
              const isEntregado = ["entregado", "completado"].includes((c.estadoEntrega || "").toLowerCase());

              return (
                <article key={c.id} className="lista-card">
                  <div className="lista-img">
                    <img
                      src={c.imagen}
                      alt={c.nombre}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = "/src/data/img/remera-negra-manga-corta.png";
                      }}
                    />
                  </div>

                  <div className="lista-info">
                    <div className="lista-header-row">
                      <h2>{c.nombre}</h2>
                      {isEntregado ? (
                        <span className="badge-entregado">
                          <FaCheck /> Entregado
                        </span>
                      ) : (
                        <span className="badge-custodia">
                          <FaShieldAlt /> En custodia / Esperando entrega
                        </span>
                      )}
                    </div>

                    {c.descripcion && <p className="lista-desc">{c.descripcion}</p>}

                    <dl className="lista-datos">
                      <div>
                        <dt>Vendedor</dt>
                        <dd style={{ fontSize: "16px" }}>{c.vendedor}</dd>
                      </div>
                      <div>
                        <dt>Precio abonado</dt>
                        <dd>{formatPrice(c.precio)}</dd>
                      </div>
                    </dl>

                    {/* Caja de Seguridad / Voucher destacado Click-to-copy */}
                    {!isEntregado ? (
                      <div
                        className={`voucher-destacado ${copiedId === c.id ? "copiado" : ""}`}
                        onClick={() => handleCopy(c.codigoSecreto, c.id)}
                        title="Hacé click en cualquier parte del recuadro para copiar el código"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCopy(c.codigoSecreto, c.id);
                          }
                        }}
                      >
                        <span className="voucher-title">
                          {copiedId === c.id ? (
                            <>
                              <FaCheck /> ¡Código copiado al portapapeles!
                            </>
                          ) : (
                            <>
                              <FaCopy /> Código de retiro (Click para copiar)
                            </>
                          )}
                        </span>

                        <strong className="voucher-codigo-digits">
                          {c.codigoSecreto}
                        </strong>

                        <p className="voucher-instruccion">
                          <FaShieldAlt /> Mostrale este código de 6 dígitos al vendedor cuando te entregue la prenda.
                        </p>
                      </div>
                    ) : (
                      <div className="estado-entregado">
                        Entrega confirmada y fondos liberados al vendedor
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

export default MisCompras;