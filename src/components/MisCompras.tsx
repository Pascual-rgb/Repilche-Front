import { useState } from "react";
import { pedidosMock } from "../data/PedidosEje";
import "./styles/MisListas.css";

const MisCompras = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const compras = pedidosMock;

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((current) => (current === code ? null : current));
      }, 2000);
    } catch (err) {
      console.error("Error al copiar el código:", err);
    }
  };

  return (
    <main className="lista-page">
      <section className="lista-container">
        <h1 className="lista-title">Mis compras</h1>
        <p className="lista-subtitle">
          Mostrale el código al moderador para retirar tu prenda.
        </p>

        {compras.length === 0 ? (
          <div className="lista-vacia"><p>Todavía no hiciste ninguna compra.</p></div>
        ) : (
          <div className="lista-grid">
            {compras.map((c) => (
              <article key={c.id} className="lista-card">
                <div className="lista-img">
                  <img src={c.producto.img as string} alt={c.producto.name as string} />
                </div>

                <div className="lista-info">
                  <h2>{c.producto.name}</h2>
                  <p className="lista-desc">{c.producto.descrp}</p>

                  <dl className="lista-datos">
                    <div><dt>Comprador</dt><dd>{c.comprador}</dd></div>
                    <div><dt>Vendedor</dt><dd>{c.vendedor}</dd></div>
                    <div><dt>Teléfono del vendedor</dt><dd>{c.telefonoVendedor}</dd></div>
                    <div><dt>Precio</dt><dd>${c.producto.precio}</dd></div>
                  </dl>

                  {c.estado === "pendiente" ? (
                    <div 
                      className={`codigo-box ${copiedCode === c.codigo ? "copiado" : ""}`}
                      onClick={() => handleCopy(c.codigo)}
                      title="Hacé click para copiar el código"
                    >
                      <span>{copiedCode === c.codigo ? "¡Código copiado!" : "Código para retirar"}</span>
                      <strong>{c.codigo}</strong>
                    </div>
                  ) : (
                    <div className="estado-entregado">Entregado</div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MisCompras;