import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importa BrowserRouter
import App from './App.tsx';
import './index.css';
import './components/styles/fonts.css';
import { CarritoProvider } from './context/CartContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontró el elemento con id "root" en el HTML.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Envuélvelo aquí para que las rutas funcionen */}
      <CarritoProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CarritoProvider>
    </BrowserRouter>
  </React.StrictMode>
);