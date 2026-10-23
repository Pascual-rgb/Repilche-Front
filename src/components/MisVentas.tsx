import { useState } from "react";
import { pedidosMock } from "../data/PedidosEje";
import type { Pedido } from "../data/PedidosEje";
import "./styles/MisListas.css";

const VentaCard = ({ pedido }: { pedido: Pedido }) => {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState(pedido.estado);
  const [mensaje, setMensaje] = useState("");

  const validar = async () => {

    if (codigo === pedido.codigo) {
      setEstado("entregado");
      setMensaje("");
    } else {
      setMensaje("El código no es correcto. Pedile al comprador que lo revise.");
    }
  };

  return (
    <article className="lista-card">
      <div className="lista-img">
        <img src={pedido.producto.img as string} alt={pedido.producto.name as string} />
      </div>

      <div className="lista-info">
        <h2>{pedido.producto.name}</h2>

        <dl className="lista-datos">
          <div><dt>Comprador</dt><dd>{pedido.comprador}</dd></div>
          <div><dt>Precio</dt><dd>${pedido.producto.precio}</dd></div>
        </dl>

        {estado === "entregado" ? (
          <div className="estado-entregado">Entrega confirmada</div>
        ) : (
          <div className="validar-box">
            <label htmlFor={`codigo-${pedido.id}`}>Código del comprador</label>
            <div className="validar-fila">
              <input
                id={`codigo-${pedido.id}`}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="lista-btn"
                disabled={codigo.length !== 6}
                onClick={validar}
              >
                Validar
              </button>
            </div>
            {mensaje && <p className="validar-error">{mensaje}</p>}
          </div>
        )}
      </div>
    </article>
  );
};

const MisVentas = () => {

  const ventas = pedidosMock;

  return (
    <main className="lista-page">
      <section className="lista-container">
        <h1 className="lista-title">Mis ventas</h1>
        <p className="lista-subtitle">
          Antes de entregar la prenda, pedile el código al comprador y validalo acá.
        </p>

        {ventas.length === 0 ? (
          <div className="lista-vacia"><p>Todavía no tenés ventas.</p></div>
        ) : (
          <div className="lista-grid">
            {ventas.map((v) => <VentaCard key={v.id} pedido={v} />)}
          </div>
        )}
      </section>
    </main>
  );
};

export default MisVentas;