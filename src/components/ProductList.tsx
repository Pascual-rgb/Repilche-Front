import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Products } from '../data/products.ts';
import './styles/Home.css';

interface ProductListProps {
  products?: Products[];
}

export const ProductList: React.FC<ProductListProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Products[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;

    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';
        const response = await fetch(`${apiUrl}/products/`);

        if (!response.ok) {
          throw new Error('Error al obtener los productos de la base de datos');
        }

        const data = await response.json();

        // Manejo defensivo: DRF devuelve paginación { count: n, results: [...] } o array directo
        const rawList = Array.isArray(data) ? data : data?.results || [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalizedList: Products[] = rawList.map((item: any, idx: number) => {
          const itemImg =
            item?.imagen_url ||
            item?.imagen ||
            item?.image ||
            item?.img ||
            '/src/data/img/remera-negra-manga-corta.png';

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

          return {
            id: item?.id ?? idx + 1,
            name: item?.name || item?.nombre || 'Prenda sin nombre',
            descrp: item?.descrp || item?.descripcion || item?.description || 'Sin descripción disponible',
            img: itemImg,
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
          setProducts(normalizedList);
        }
      } catch (error) {
        console.warn('No se pudieron obtener productos del backend:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  const safeProducts = Array.isArray(products) ? products : [];
  const sliderProducts = safeProducts.slice(0, 7);

  const handleNext = () => {
    if (sliderProducts.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === sliderProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNextBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNext();
  };

  useEffect(() => {
    if (sliderProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }, [sliderProducts.length]);

  if (loading) {
    return <div className="product-list-container">Cargando productos...</div>;
  }

  if (sliderProducts.length === 0) return null;

  const currentProduct = sliderProducts[currentIndex] || sliderProducts[0];
  if (!currentProduct) return null;

  return (
    <div className="product-list-container">
      <button className="slider-btn prev-btn" onClick={handlePrev}>&lt;</button>

      <Link
        to={`/producto/${currentProduct.id}`}
        className="product-list-card"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="product-list-img-box">
          <img
            src={
              (currentProduct as any)?.imagen_url ||
              (currentProduct as any)?.imagen ||
              (currentProduct as any)?.image ||
              currentProduct.img ||
              '/src/data/img/remera-negra-manga-corta.png'
            }
            alt={currentProduct.name || 'Prenda'}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('remera-negra-manga-corta.png')) {
                target.src = '/src/data/img/remera-negra-manga-corta.png';
              }
            }}
          />
        </div>
        <div className="product-list-details">
          <h2 className="product-list-title">{currentProduct.name || 'Prenda'}</h2>
          <p className="product-list-desc">
            <strong>Descripción:</strong> {currentProduct.descrp || 'Sin descripción'}
          </p>
          <p className="product-list-seller">
            <strong>Vendedor:</strong> {currentProduct.vendedor || 'Repilche'}
          </p>
          <div className="product-list-price">${currentProduct.precio || 0}</div>
        </div>
      </Link>

      <button className="slider-btn next-btn" onClick={handleNextBtn}>&gt;</button>
    </div>
  );
};