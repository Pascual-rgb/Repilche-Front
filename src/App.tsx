import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import { Home } from "./components/home";
import { ProductList } from "./components/ProductList";
import CargaProduct from "./components/CargaProduct";
import Contact from "./components/Contact";
import Login from "./components/LoginForm";
import User from "./components/User";
import Notis from "./components/Notis";
import SerVendedor from "./components/SerVendedorForm";
import ProductoDetail from "./components/ProductoDetail";
import { productos } from "./data/products";
import EditarPerfil from "./components/EditarPerfil";

function App() {
  const location = useLocation();

  // Lista de rutas donde NO quieres que aparezca el Header
  const hideHeaderPaths = ["/login", "/ser-vendedor", "/serVendedor"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {/* El Header solo se muestra si NO estamos en una ruta de formulario */}
      {!shouldHideHeader && <Header />}

      <main style={{ padding: "20px" }}>
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Catálogo de productos */}
          <Route
            path="/products"
            element={<ProductList products={productos} />}
          />

          {/* Cargar producto */}
          <Route
            path="/cargar-producto"
            element={<CargaProduct />}
          />

          {/* Contacto */}
          <Route path="/contact" element={<Contact />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Usuario */}
          <Route path="/user" element={<User />} />

          {/* Notificaciones */}
          <Route path="/notifications" element={<Notis />} />
          <Route path="/notis" element={<Notis />} />

          {/* Ser vendedor */}
          <Route path="/ser-vendedor" element={<SerVendedor />} />
          <Route path="/serVendedor" element={<SerVendedor />} />

          {/* Cargar producto - ruta alternativa */}
          <Route path="/cargaProduct" element={<CargaProduct />} />

          {/* Página de producto */}
          <Route
            path="/producto/:id"
            element={<ProductoDetail />}
          />

          {/* Página por defecto */}
          <Route path="*" element={<Home />} />

          <Route path="/editar-perfil" element={<EditarPerfil />}/>
        </Routes>
      </main>

      {/* Footer */}
      <Contact />
    </>
  );
}

export default App;