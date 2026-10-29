import React, { useState, useEffect } from 'react';
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import type { Products } from '../data/products.ts';
import './styles/Home.css';

export const Home: React.FC = () => {
  const [backendProducts, setBackendProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';
        const res = await fetch(`${apiUrl}/products/`);
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data) ? data : data?.results || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const normalized: Products[] = rawList.map((item: any, idx: number) => {
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
              vendedor:
                typeof item?.vendedor === 'string'
                  ? item.vendedor
                  : item?.vendedor?.first_name
                  ? `${item.vendedor.first_name} ${item.vendedor.last_name || ''}`.trim()
                  : item?.vendedor_nombre || 'Repilche',
            };
          });

          if (isMounted) {
            setBackendProducts(normalized);
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

  const displayProducts = backendProducts;

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
