import { Link } from "react-router-dom";
import { productos } from "../data/products";
import { MI_NOMBRE } from "../data/PedidosEje";
import "./styles/MisListas.css";

const MisProductos = () => {

  const misProductos = productos.filter((p) => p.vendedor === MI_NOMBRE);

  return (
    <main className="lista-page">
      <section className="lista-container">
        <h1 className="lista-title">Mis productos</h1>
        <p className="lista-subtitle">Las prendas que publicaste en Repilche.</p>

        {misProductos.length === 0 ? (
          <div className="lista-vacia">
            <p>Todavía no subiste ninguna prenda.</p>
            <Link to="/cargar-producto" className="lista-btn">Cargar producto</Link>
          </div>
        ) : (
          <div className="lista-grid">
            {misProductos.map((p) => (
              <article key={p.id} className="lista-card">
                <div className="lista-img">
                  <img src={p.img as string} alt={p.name as string} />
                </div>

                <div className="lista-info">
                  <h2>{p.name}</h2>
                  <p className="lista-desc">{p.descrp}</p>

                  <dl className="lista-datos">
                    <div><dt>Categoría</dt><dd>{p.cat.join(", ")}</dd></div>
                    <div><dt>Stock</dt><dd>{p.stock}</dd></div>
                    <div><dt>Precio</dt><dd>${p.precio}</dd></div>
                  </dl>

                  <Link to={`/producto/${p.id}`} className="lista-btn">Ver detalle</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MisProductos;