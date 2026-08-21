import React from 'react';
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import { productos } from '../data/products.ts';
import './styles/Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Nuevo Header de Categorías */}
     

      <section className="home-section-top">
        <h2 className="section-title">Productos Destacados</h2>
        <ProductList products={productos} />
      </section>

      <section className="home-section-grid">
        <h2 className="section-title">Productos</h2>
        <div className="product-grid">
          {productos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}; 
