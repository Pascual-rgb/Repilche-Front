import React from 'react';
import { Link } from 'react-router-dom';
import type { Products } from '../data/products.ts';
import './styles/ProductCard.css';

interface ProductCardProps {
  product: Products;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) return null;

  console.log('Datos del producto recibido:', product);

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

        <div className="product-card-img-container">
          <img
            src={portada}
            alt={nombre}
            className="product-card-img"
            onError={(e) => {
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