import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import type { Products as ProductType } from "../data/products";
import { coincideCategoria } from "../utils/categories";
import { intercalarPorVendedor } from "../utils/intercalarProductos";
import "./styles/Home.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeProducts = (rawList: any[]): ProductType[] => {
  return rawList.map((item: any, idx: number) => {
    const rawCat = item?.categoria;
    const catId = item?.categoria_id ?? (typeof rawCat === 'number' ? rawCat : rawCat?.id);
    const catNombre =
      item?.categoria_nombre ||
      item?.categoria_detail?.nombre ||
      (typeof rawCat === 'string' ? rawCat : rawCat?.nombre) ||
      '';

    const catList: string[] = Array.isArray(item?.cat)
      ? item.cat
      : catNombre
        ? [catNombre]
        : ['General'];

    const rawImg = String(
      item?.imagen || item?.imagen_url || item?.image || item?.img || ''
    );
    const portada =
      rawImg
        .split(',')
        .map((url: string) => url.trim())
        .filter(Boolean)[0] || "/src/data/img/remera-negra-manga-corta.png";

    return {
      id: item?.id ?? idx + 1,
      name: item?.name || item?.nombre || "Prenda sin nombre",
      descrp: item?.descrp || item?.descripcion || item?.description || "Sin descripción disponible",
      img: portada,
      imagen: rawImg || portada,
      stock: Number(item?.stock ?? 1),
      cat: catList,
      categoria: rawCat,
      categoria_id: catId,
      categoria_nombre: catNombre,
      categoria_detail: item?.categoria_detail,
      precio: Number(item?.precio || item?.price || 0),
      vendedor_id: item?.vendedor_id ?? (typeof item?.vendedor === 'object' ? item?.vendedor?.id : undefined),
      vendedor:
        item?.vendedor_nombre ||
        item?.vendedor?.first_name ||
        item?.vendedor?.nombre ||
        (typeof item?.vendedor === "string" && item?.vendedor !== "Repilche" ? item.vendedor : "") ||
        "Vendedor",
    };
  });
};

const Products = () => {
  const [params] = useSearchParams();
  const category = params.get("category")?.toLowerCase();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";
        const res = await fetch(`${apiUrl}/products/`);
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : data?.results || [];
          const normalized = normalizeProducts(rawList);
          const intercalados = intercalarPorVendedor(normalized);

          if (isMounted) {
            setProducts(intercalados);
            setNextPage(data?.next || null);
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

  const cargarMas = useCallback(async () => {
    if (!nextPage || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const res = await fetch(nextPage);
      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data) ? data : data?.results || [];
        const nuevos = normalizeProducts(rawList);
        const intercaladosNuevos = intercalarPorVendedor(nuevos);
        setProducts((prev) => [...prev, ...intercaladosNuevos]);
        setNextPage(data?.next || null);
      }
    } catch (err) {
      console.warn("Error al cargar más productos:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [nextPage, isFetchingMore]);

  useEffect(() => {
    if (!nextPage || isFetchingMore) return;

    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          cargarMas();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [nextPage, isFetchingMore, cargarMas]);

  const filtrados = category
    ? products.filter((p) => coincideCategoria(p, category))
    : products;

  const tituloSeccion = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Todos los productos";

  return (
    <div className="home-container">
      <h2 className="section-title">
        {tituloSeccion}
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
        <>
          <div className="product-grid">
            {filtrados.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {nextPage && (
            <div
              ref={observerRef}
              className="py-8 text-center text-gray-500 text-sm animate-pulse"
              style={{ textAlign: "center", padding: "32px 0", color: "#6b7280", fontSize: "0.875rem" }}
            >
              Cargando más prendas...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;