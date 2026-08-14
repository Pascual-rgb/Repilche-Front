import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaUser } from "react-icons/fa";
import { productos } from "../data/products";
import "./styles/ProductoDetail.css";

const ProductoDetail = () => {
  const { id } = useParams();

  const producto = productos.find(
    (producto) => producto.id === Number(id)
  );

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

  return (
    <main className="producto-detail-page">
      <section className="producto-detail-container">

        <Link to="/" className="volver-btn">
          <FaArrowLeft />
          Volver a productos
        </Link>

        <div className="producto-detail">

          <div className="producto-detail-image">
            <img
              src={producto.img as string}
              alt={producto.name as string}
            />
          </div>

          <div className="producto-detail-info">

            <span className="producto-detail-category">
              {producto.cat.join(", ")}
            </span>

            <h1>{producto.name}</h1>

            <p className="producto-detail-description">
              {producto.descrp}
            </p>

            <div className="producto-detail-price">
              ${producto.precio}
            </div>

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

            <button className="producto-detail-cart">
              <FaShoppingCart />
              Agregar al carrito
            </button>

          </div>

        </div>
      </section>
    </main>
  );
};

export default ProductoDetail;