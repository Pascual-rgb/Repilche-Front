import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import type { Products } from '../data/products.ts';
import { intercalarPorVendedor } from '../utils/intercalarProductos';
import './styles/Home.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeProducts = (rawList: any[]): Products[] => {
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
        .filter(Boolean)[0] || '/src/data/img/remera-negra-manga-corta.png';

    return {
      id: item?.id ?? idx + 1,
      name: item?.name || item?.nombre || 'Prenda sin nombre',
      descrp: item?.descrp || item?.descripcion || item?.description || 'Sin descripción disponible',
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
        typeof item?.vendedor === 'string'
          ? item.vendedor
          : item?.vendedor?.first_name
          ? `${item.vendedor.first_name} ${item.vendedor.last_name || ''}`.trim()
          : item?.vendedor_nombre || 'Repilche',
    };
  });
};

export const Home: React.FC = () => {
  const [productos, setProductos] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';
        const res = await fetch(`${apiUrl}/products/`);
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : data?.results || [];
          const normalized = normalizeProducts(rawList);
          const intercalados = intercalarPorVendedor(normalized);

          if (isMounted) {
            setProductos(intercalados);
            setNextPage(data?.next || null);
          }
        }
      } catch (err) {
        console.warn('No se pudieron obtener productos para la home:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHomeProducts();
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
        setProductos((prev) => [...prev, ...intercaladosNuevos]);
        setNextPage(data?.next || null);
      }
    } catch (err) {
      console.warn('Error al cargar más productos:', err);
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

  const displayProducts = productos;

  if (loading) {
    return (
      <div className="home-container" style={{ textAlign: 'center', padding: '80px 20px', color: '#666' }}>
        <p>Cargando catálogo oficial de Repilche...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {displayProducts.length > 0 ? (
        <>
          <section className="home-section-top">
            <h2 className="section-title">Productos Destacados</h2>
            <ProductList products={displayProducts} />
          </section>

          <section className="home-section-grid">
            <h2 className="section-title">Productos</h2>
            <div className="product-grid">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {nextPage && (
              <div
                ref={observerRef}
                className="py-8 text-center text-gray-500 text-sm animate-pulse"
                style={{ textAlign: 'center', padding: '32px 0', color: '#6b7280', fontSize: '0.875rem' }}
              >
                Cargando más prendas...
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="home-section-grid" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2 className="section-title">Productos</h2>
          <p style={{ color: '#666' }}>No hay prendas disponibles en este momento.</p>
        </section>
      )}
    </div>
  );
}; 
