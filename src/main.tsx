import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Archivo de estilos globales (opcional)
import './components/styles/fonts.css'

// Buscar el elemento contenedor en el HTML
const rootElement = document.getElementById('root');

// Validar que el elemento exista para evitar errores en TypeScript
if (!rootElement) {
  throw new Error('No se encontró el elemento con id "root" en el HTML.');
}

// Crear el root de React y renderizar la aplicación
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);