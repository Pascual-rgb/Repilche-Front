import React from 'react';
import { Link } from 'react-router-dom';
import type { Products } from '../data/products.ts';
import './styles/ProductCard.css';

interface ProductCardProps {
  product: Products;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) return null;

  // Manejo seguro con optional chaining y fallbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProduct = product as any;
  const nombre = product.name || rawProduct.nombre || 'Prenda';
  const precio = product.precio || rawProduct.price || 0;
  const imagen = product.img || rawProduct.imagen_url || rawProduct.imagen || '/src/data/img/remera-negra-manga-corta.png';
  
  const categorias = Array.isArray(product.cat)
    ? product.cat.join(', ')
    : rawProduct.categoria_detail?.nombre || rawProduct.categoria || 'General';

  const vendedor = typeof product.vendedor === 'string'
    ? product.vendedor
    : rawProduct.vendedor?.first_name
    ? `${rawProduct.vendedor.first_name} ${rawProduct.vendedor.last_name || ''}`.trim()
    : rawProduct.vendedor_nombre || 'Repilche';

  return (
    <Link to={`/producto/${product.id}`} className="product-card-link">
      <div className="product-card">
        <div className="product-card-header">
          <h3 className="product-card-name">{nombre}</h3>
        </div>

        <div className="product-card-img-container">
          <img
            src={imagen}
            alt={nombre}
            className="product-card-img"
          />
        </div>

        <div className="product-card-footer">
          <div className="product-card-info">
            <span className="product-card-cat">
              {categorias}
            </span>

            <span className="product-card-seller">
              {vendedor}
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