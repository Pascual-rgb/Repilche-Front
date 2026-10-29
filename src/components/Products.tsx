import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import type { Products as ProductType } from "../data/products";
import "./styles/Home.css";

const Products = () => {
  const [params] = useSearchParams();
  const category = params.get("category")?.toLowerCase();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";
        const res = await fetch(`${apiUrl}/products/`);
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : data?.results || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalized: ProductType[] = rawList.map((item: any, idx: number) => ({
            id: item?.id ?? idx + 1,
            name: item?.name || item?.nombre || "Prenda sin nombre",
            descrp: item?.descrp || item?.descripcion || item?.description || "Sin descripción disponible",
            img: item?.imagen_url || item?.imagen || item?.image || item?.img || "/src/data/img/remera-negra-manga-corta.png",
            stock: Number(item?.stock ?? 1),
            cat: Array.isArray(item?.cat)
              ? item.cat
              : item?.categoria_detail?.nombre
              ? [item.categoria_detail.nombre]
              : typeof item?.categoria === "string"
              ? [item.categoria]
              : ["General"],
            precio: Number(item?.precio || item?.price || 0),
            vendedor:
              typeof item?.vendedor === "string"
                ? item.vendedor
                : item?.vendedor?.first_name
                ? `${item.vendedor.first_name} ${item.vendedor.last_name || ""}`.trim()
                : item?.vendedor_nombre || "Repilche",
          }));

          if (isMounted) {
            setProducts(normalized);
          }
        }
      } catch (err) {
        console.warn("No se pudieron obtener productos del catálogo:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtrados = category
    ? products.filter((p) =>
        p.cat.some((c) => c.toLowerCase().includes(category))
      )
    : products;

  return (
    <div className="home-container">
      <h2 className="section-title">
        {category ? category : "Todos los productos"}
      </h2>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
          Cargando catálogo...
        </div>
      ) : filtrados.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
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