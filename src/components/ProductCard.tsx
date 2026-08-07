import React from 'react';
import type { Products } from '../data/products.ts';
import './ProductCard.css';

interface ProductCardProps {
  product: Products;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card-header">
        <h3 className="product-card-name">{product.name}</h3>
      </div>
      <div className="product-card-img-container">
        <img src={product.img as string} alt={product.name as string} className="product-card-img" />
      </div>
      <div className="product-card-footer">
        <div className="product-card-info">
          <span className="product-card-cat">{product.cat.join(', ')}</span>
          <span className="product-card-seller">{product.vendedor}</span>
        </div>
        <span className="product-card-price">${product.precio}</span>
      </div>
    </div>
  );
};