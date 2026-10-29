import React, { useState, useEffect } from 'react';
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import { productos, type Products } from '../data/products.ts';
import './styles/Home.css';

export const Home: React.FC = () => {
  const [backendProducts, setBackendProducts] = useState<Products[]>([]);

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
          const normalized: Products[] = rawList.map((item: any, idx: number) => ({
            id: item?.id ?? idx + 1,
            name: item?.name || item?.nombre || 'Prenda sin nombre',
            descrp: item?.descrp || item?.descripcion || item?.description || 'Sin descripción disponible',
            img: item?.imagen_url || item?.imagen || item?.image || item?.img || '/src/data/img/remera-negra-manga-corta.png',
            stock: Number(item?.stock ?? 1),
            cat: Array.isArray(item?.cat)
              ? item.cat
              : item?.categoria_detail?.nombre
              ? [item.categoria_detail.nombre]
              : typeof item?.categoria === 'string'
              ? [item.categoria]
              : ['General'],
            precio: Number(item?.precio || item?.price || 0),
            vendedor:
              typeof item?.vendedor === 'string'
                ? item.vendedor
                : item?.vendedor?.first_name
                ? `${item.vendedor.first_name} ${item.vendedor.last_name || ''}`.trim()
                : item?.vendedor_nombre || 'Repilche',
          }));

          if (isMounted && normalized.length > 0) {
            setBackendProducts(normalized);
          }
        }
      } catch (err) {
        console.warn('No se pudieron obtener productos para la home:', err);
      }
    };

    fetchHomeProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayProducts = backendProducts.length > 0 ? backendProducts : productos;

  return (
    <div className="home-container">
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
    </div>
  );
}; 
