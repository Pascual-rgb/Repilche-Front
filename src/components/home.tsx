import React from 'react';
import { ProductList } from './ProductList';
import { ProductCard } from './ProductCard';
import { productos } from '../data/products'; 
import { categorias } from '../data/categorias'; // Importación de categorías
import "./styles/Home.css";

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Nuevo Header de Categorías */}
      <nav className="categories-header">
        <ul className="categories-list">
          {categorias.map((categoria, index) => (
            <li key={index} className="category-item">
              {categoria}
            </li>
          ))}
        </ul>
      </nav>

      <section className="home-section-top">
        <ProductList products={productos} />
      </section>

      <section className="home-section-grid">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="product-grid">
          {productos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};