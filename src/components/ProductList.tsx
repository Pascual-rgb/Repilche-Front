import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Products } from '../data/products.ts';
import "./styles/Home.css";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://repilche-backend.onrender.com/api/products/');
        
        if (!response.ok) {
          throw new Error('Error al obtener los productos de la base de datos');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Hubo un error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const sliderProducts = products.slice(0, 7);

  useEffect(() => {
    if (sliderProducts.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, sliderProducts.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sliderProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (sliderProducts.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === sliderProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleNextBtn = (e: React.MouseEvent) => {
    e.preventDefault();
    handleNext();
  };

  if (loading) {
    return <div className="product-list-container">Cargando productos...</div>;
  }

  if (sliderProducts.length === 0) return null;

  const currentProduct = sliderProducts[currentIndex];
  return (
    <div className="product-list-container">
      <button className="slider-btn prev-btn" onClick={handlePrev}>&lt;</button>
      
      <Link to={`/producto/${currentProduct.id}`} className="product-list-card" style={{ textDecoration: 'none', color: 'inherit' }}>
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