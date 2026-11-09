import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Products } from '../data/products.ts';
import { intercalarPorVendedor } from '../utils/intercalarProductos';
import './styles/Home.css';

interface ProductListProps {
  products?: Products[];
  loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products: initialProducts, loading: loadingProp }) => {
  const [products, setProducts] = useState<Products[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(loadingProp ?? (!initialProducts || initialProducts.length === 0));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loadingProp !== undefined) {
      setLoading(loadingProp);
    }
  }, [loadingProp]);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(intercalarPorVendedor(initialProducts));
      if (loadingProp === undefined) {
        setLoading(false);
      }
    }
  }, [initialProducts, loadingProp]);

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
          const rawItemImg = String(
            item?.imagen ||
            item?.imagen_url ||
            item?.image ||
            item?.img ||
            ''
          );
          const itemImg =
            rawItemImg
              .split(',')
              .map((url: string) => url.trim())
              .filter(Boolean)[0] ||
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
              item?.vendedor_nombre ||
              item?.vendedor?.first_name ||
              item?.vendedor?.nombre ||
              (typeof item?.vendedor === 'string' && item?.vendedor !== 'Repilche' ? item.vendedor : '') ||
              'Vendedor',
          };
        });

        if (isMounted) {
          setProducts(intercalarPorVendedor(normalizedList));
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

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }
  }, [currentIndex, sliderProducts]);

  if (loading) {
    return (
      <div className="product-list-container" aria-hidden="true">
        <div className="product-list-card animate-pulse">
          <div className="product-list-img-box" style={{ backgroundColor: '#e5e1ee', position: 'relative' }} />
          <div className="product-list-details" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ height: '28px', width: '60%', backgroundColor: '#d4cbe4', borderRadius: '6px' }} />
            <div style={{ height: '16px', width: '90%', backgroundColor: '#d4cbe4', borderRadius: '4px' }} />
            <div style={{ height: '16px', width: '40%', backgroundColor: '#d4cbe4', borderRadius: '4px' }} />
            <div style={{ height: '32px', width: '100px', backgroundColor: '#d4cbe4', borderRadius: '6px', marginTop: '10px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (sliderProducts.length === 0) return null;

  const currentProduct = sliderProducts[currentIndex] || sliderProducts[0];
  if (!currentProduct) return null;

  const placeholder = '/src/data/img/remera-negra-manga-corta.png';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCurrent = currentProduct as any;
  const rawCurrentImg = String(
    rawCurrent?.imagen ||
    rawCurrent?.imagen_url ||
    rawCurrent?.image ||
    currentProduct.img ||
    ''
  );
  const portada =
    rawCurrentImg
      .split(',')
      .map((url: string) => url.trim())
      .filter(Boolean)[0] || placeholder;

  return (
    <div className="product-list-container">
      <button className="slider-btn prev-btn" onClick={handlePrev}>&lt;</button>

      <Link
        to={`/producto/${currentProduct.id}`}
        className="product-list-card"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="product-list-img-box" style={{ position: 'relative' }}>
          {!imageLoaded && (
            <div
              className="animate-pulse"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#e5e1ee',
                borderRadius: '8%',
              }}
              aria-hidden="true"
            />
          )}
          <img
            ref={imgRef}
            src={portada}
            alt={currentProduct.name || 'Prenda'}
            style={{
              transition: 'opacity 0.25s ease-in-out',
              opacity: imageLoaded ? 1 : 0,
            }}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageLoaded(true);
              const target = e.currentTarget;
              if (!target.src.includes('remera-negra-manga-corta.png')) {
                target.src = placeholder;
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
            <strong>Vendedor:</strong> {currentProduct.vendedor || 'Vendedor'}
          </p>
          <div className="product-list-price">${currentProduct.precio || 0}</div>
        </div>
      </Link>

      <button className="slider-btn next-btn" onClick={handleNextBtn}>&gt;</button>
    </div>
  );
};