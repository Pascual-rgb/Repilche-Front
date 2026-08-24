import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Cart from "./components/Cart";
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

  const hideHeaderPaths = ["/login", "/ser-vendedor", "/serVendedor"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      
      {/* Panel superpuesto del carrito disponible en toda la app */}
      <Cart />

      <main style={{ padding: "20px" }}>
        <Routes>
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
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/notifications" element={<Notis />} />
          <Route path="/notis" element={<Notis />} />
          <Route path="/ser-vendedor" element={<SerVendedor />} />
          <Route path="/serVendedor" element={<SerVendedor />} />
          <Route path="/cargaProduct" element={<CargaProduct />} />
          <Route path="/producto/:id" element={<ProductoDetail />} />
          <Route path="*" element={<Home />} />

          <Route path="/editar-perfil" element={<EditarPerfil />}/>
        </Routes>
      </main>

      <Contact />
    </>
  );
}

export default App;