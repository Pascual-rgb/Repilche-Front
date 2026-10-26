import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Cart from "./components/Cart";
import { Home } from "./components/home";
import CargaProduct from "./components/CargaProduct";
import Contact from "./components/Contact";
import Login from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import User from "./components/User";
import Notis from "./components/Notis";
import SerVendedor from "./components/SerVendedorForm";
import ProductoDetail from "./components/ProductoDetail";
import EditarPerfil from "./components/EditarPerfil";
import Products from "./components/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import MisProductos from "./components/MisProductos";
import MisCompras from "./components/MisCompras";
import MisVentas from "./components/MisVentas";
import { useAuthContext } from "./context/AuthContext";
import { Analytics } from "@vercel/analytics/react"

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuthContext();

  const hideHeaderPaths: string[] = [];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!shouldHideHeader && <Header />}

      <Cart />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroForm />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/producto/:id" element={<ProductoDetail />} />
            <Route path="/cargar-producto" element={<CargaProduct />} />
            <Route path="/cargaProduct" element={<CargaProduct />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user" element={<User />} />
            <Route path="/notifications" element={<Notis />} />
            <Route path="/notis" element={<Notis />} />
            <Route path="/ser-vendedor" element={<SerVendedor />} />
            <Route path="/serVendedor" element={<SerVendedor />} />
            <Route path="/editar-perfil" element={<EditarPerfil />} />
            <Route path="/mis-productos" element={<MisProductos />} />
            <Route path="/mis-compras" element={<MisCompras />} />
            <Route path="/mis-ventas" element={<MisVentas />} />
          </Route>

          <Route path="*" element={<Login />} />
        </Routes>
      </main>

      {isLoggedIn && location.pathname !== "/contact" && <Contact />}
      <Analytics />
    </>
  );
}

export default App;