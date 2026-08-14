import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/home';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CargaProduct from './components/CargaProduct';
import Contact from './components/Contact';
import Login from './components/LoginForm';
import User from './components/User';
import Notis from './components/Notis';
import SerVendedor from './components/SerVendedorForm';

function App() {
  return (
    <Router>
      <Header />
      
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* Ruta principal / Home */}
          <Route path="/" element={<Home />} />
          
          {/* Catálogo de productos */}
          <Route path="/products" element={<ProductList />} />
          
          {/* Carrito de compras */}
          <Route path="/cart" element={<Cart />} />
          
          {/* Panel o vista para cargar productos (rol vendedor/admin) */}
          <Route path="/cargar-producto" element={<CargaProduct />} />
          
          {/* Formulario de contacto */}
          <Route path="/contact" element={<Contact />} />
          
          {/* Autenticación (Login / Registro) */}
          <Route path="/login" element={<Login />} />
          
          {/* Perfil de usuario */}
          <Route path="/user" element={<User />} />
          
          {/* Sección de notificaciones */}
          <Route path="/notifications" element={<Notis />} />
          
          {/* Sección / Formulario para convertirse en vendedor */}
          <Route path="/ser-vendedor" element={<SerVendedor />} />
          
          {/* Ruta por defecto para manejar páginas no encontradas (404) */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;