import React, { useState, useEffect } from 'react';
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
    }, 15000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sliderProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (sliderProducts.length === 0) return null;

  const currentProduct = sliderProducts[currentIndex];

  return (
    <div className="product-list-container">
      <button className="slider-btn prev-btn" onClick={handlePrev}>&lt;</button>
      
      <div className="product-list-card">
        <div className="product-list-img-box">
          <img src={currentProduct.img as string} alt={currentProduct.name as string} />
        </div>
        <div className="product-list-details">
          <h2 className="product-list-title"><u>{currentProduct.name}</u></h2>
          <p className="product-list-desc"><strong>Descripción:</strong> {currentProduct.descrp}</p>
          <p className="product-list-seller"><strong>Vendedor:</strong> {currentProduct.vendedor}</p>
          <div className="product-list-price">${currentProduct.precio}</div>
        </div>
      </div>

      <button className="slider-btn next-btn" onClick={handleNext}>&gt;</button>
    </div>
  );
};