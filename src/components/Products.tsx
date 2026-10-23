import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { productos } from "../data/products";
import "./styles/Home.css";

const Products = () => {
  const [params] = useSearchParams();
  const category = params.get("category")?.toLowerCase();

  const filtrados = category
    ? productos.filter((p) =>
        p.cat.some((c) => c.toLowerCase().includes(category))
      )
    : productos;

  return (
    <div className="home-container">
      <h2 className="section-title">
        {category ? category : "Todos los productos"}
      </h2>

      {filtrados.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No hay productos en esta categoría todavía.
        </p>
      ) : (
        <div className="product-grid">
          {filtrados.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;