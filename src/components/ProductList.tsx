import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link
import type { Products } from '../data/products.ts';
import "./styles/Home.css";

interface ProductListProps {
  products: Products[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderProducts = products.slice(0, 7);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el botón dispare la navegación del Link
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sliderProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNextBtn = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el botón dispare la navegación del Link
    handleNext();
  };

  if (sliderProducts.length === 0) return null;

  const currentProduct = sliderProducts[currentIndex];

  return (
    <div className="product-list-container">
      <button className="slider-btn prev-btn" onClick={handlePrev}>&lt;</button>
      
      {/* Envolvemos toda la tarjeta en un Link hacia la vista de detalle */}
      <Link to={`/product/${currentProduct.id}`} className="product-list-card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-list-img-box">
          <img src={currentProduct.img as string} alt={currentProduct.name as string} />
        </div>
        <div className="product-list-details">
          <h2 className="product-list-title">{currentProduct.name}</h2>
          <p className="product-list-desc"><strong>Descripción:</strong> {currentProduct.descrp}</p>
          <p className="product-list-seller"><strong>Vendedor:</strong> {currentProduct.vendedor}</p>
          <div className="product-list-price">${currentProduct.precio}</div>
        </div>
      </Link>

      <button className="slider-btn next-btn" onClick={handleNextBtn}>&gt;</button>
    </div>
  );
};