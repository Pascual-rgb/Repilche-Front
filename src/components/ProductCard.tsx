import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Products } from '../data/products.ts';
import './styles/ProductCard.css';

interface ProductCardProps {
  product: Products;
}

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="product-card-link" style={{ pointerEvents: 'none' }} aria-hidden="true">
      <div className="product-card animate-pulse">
        <div className="product-card-header" style={{ display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
          <div style={{ height: '18px', width: '70%', backgroundColor: '#d8cfe6', borderRadius: '4px' }} />
        </div>

        <div className="product-card-img-container" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ width: '80%', height: '100%', backgroundColor: '#e5e7eb', borderRadius: '8px' }} />
        </div>

        <div className="product-card-footer" style={{ padding: '0 12px' }}>
          <div className="product-card-info" style={{ gap: '6px', width: '60%' }}>
            <div style={{ height: '12px', width: '80%', backgroundColor: '#d8cfe6', borderRadius: '4px' }} />
            <div style={{ height: '12px', width: '50%', backgroundColor: '#d8cfe6', borderRadius: '4px' }} />
          </div>
          <div style={{ height: '22px', width: '45px', backgroundColor: '#d8cfe6', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) return null;

  // Manejo seguro con optional chaining y fallbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProduct = product as any;
  const nombre = product.name || rawProduct.nombre || 'Prenda';
  const precio = product.precio || rawProduct.price || 0;
  const placeholder = '/src/data/img/remera-negra-manga-corta.png';
  const rawImg = String(
    rawProduct.imagen ||
    rawProduct.imagen_url ||
    rawProduct.image ||
    rawProduct.img ||
    product.img ||
    ''
  );
  const portada =
    rawImg
      .split(',')
      .map((url: string) => url.trim())
      .filter(Boolean)[0] || placeholder;
  
  const categorias = Array.isArray(product.cat)
    ? product.cat.join(', ')
    : rawProduct.categoria_detail?.nombre || rawProduct.categoria || 'General';

  const vendedorNombre =
    rawProduct.vendedor_nombre ||
    rawProduct.vendedor?.first_name ||
    rawProduct.vendedor?.nombre ||
    (typeof product.vendedor === 'string' && product.vendedor !== 'Repilche' ? product.vendedor : '') ||
    'Vendedor';

  return (
    <Link to={`/producto/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-card-header">
          <h3 className="product-card-name">{nombre}</h3>
        </div>

        <div className="product-card-img-container" style={{ position: 'relative' }}>
          {!imageLoaded && (
            <div
              className="animate-pulse"
              style={{
                position: 'absolute',
                inset: '10px',
                backgroundColor: '#e5e7eb',
                borderRadius: '8px',
              }}
              aria-hidden="true"
            />
          )}
          <img
            src={portada}
            alt={nombre}
            className="product-card-img"
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

        <div className="product-card-footer">
          <div className="product-card-info">
            <span className="product-card-cat">
              {categorias}
            </span>

            <span className="product-card-seller">
              {vendedorNombre}
            </span>
          </div>

          <span className="product-card-price">
            ${precio}
          </span>
        </div>
      </div>
    </Link>
  );
};