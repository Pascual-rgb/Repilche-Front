import React from 'react';
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import { productos } from '../data/products.ts';
import './styles/Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Sección Superior: Lista / Carrusel rotativo */}
      <section className="home-section-top">
        <h2 className="section-title">Productos Destacados</h2>
        <ProductList products={productos} />
      </section>

      {/* Sección Inferior: Filas de ProductCards (4 por fila) */}
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
