import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart, FaUser } from "react-icons/fa";
import { productos, type Products } from "../data/products";
import { useCarritoContext } from "../context/CartContext";
import "./styles/ProductoDetail.css";

const ProductoDetail = () => {
  const { id } = useParams();
  const { addToCart, openCart } = useCarritoContext();

  const localProducto = productos.find((p) => p.id === Number(id));
  const [producto, setProducto] = useState<Products | null>(localProducto || null);
  const [loading, setLoading] = useState<boolean>(!localProducto);

  useEffect(() => {
    let isMounted = true;
    const fetchProducto = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';
        const res = await fetch(`${apiUrl}/products/${id}/`);
        if (res.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item: any = await res.json();
          if (isMounted && item) {
            console.log('Datos del producto recibido en ProductoDetail:', item);
            const itemImg =
              item.imagen_url ||
              item.imagen ||
              item.image ||
              item.img ||
              '/src/data/img/remera-negra-manga-corta.png';

            setProducto({
              id: item.id,
              name: item.name || item.nombre || 'Prenda sin nombre',
              descrp: item.descrp || item.descripcion || item.description || 'Sin descripción disponible',
              img: itemImg,
              stock: Number(item.stock ?? 1),
              cat: Array.isArray(item.cat)
                ? item.cat
                : item.categoria_detail?.nombre
                ? [item.categoria_detail.nombre]
                : typeof item.categoria === 'string'
                ? [item.categoria]
                : ['General'],
              precio: Number(item.precio || item.price || 0),
              vendedor:
                typeof item.vendedor === 'string'
                  ? item.vendedor
                  : item.vendedor?.first_name
                  ? `${item.vendedor.first_name} ${item.vendedor.last_name || ''}`.trim()
                  : item.vendedor_nombre || 'Repilche',
            });
          }
        }
      } catch (err) {
        console.warn('No se pudo obtener el producto del backend:', err);
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

  console.log('Datos del producto recibido:', producto);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProduct = producto as any;
  const placeholder = '/src/data/img/remera-negra-manga-corta.png';
  const imagen =
    rawProduct.imagen_url ||
    rawProduct.imagen ||
    rawProduct.image ||
    rawProduct.img ||
    producto.img ||
    placeholder;

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
              src={imagen}
              alt={producto.name as string}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('remera-negra-manga-corta.png')) {
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

            <button className="producto-detail-cart"
              onClick={() => {
                addToCart(producto, 1);
                openCart();
              }}
            >
              <FaShoppingCart />Agregar al carrito</button>

          </div>

        </div>
      </section>
    </main>
  );
};

export default ProductoDetail;