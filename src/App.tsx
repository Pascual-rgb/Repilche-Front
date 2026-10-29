import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AdminRoute from "./components/AdminRoute";
import AdminModeracion from "./components/AdminModeracion";
import { ErrorBoundary } from "./components/ErrorBoundary";

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
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<RegistroForm />} />

            {/* Rutas públicas: navegación y catálogo libres sin login */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/producto/:id" element={<ProductoDetail />} />
            <Route path="/contact" element={<Contact />} />

            {/* Rutas estrictamente protegidas: requieren autenticación previa */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cargar-producto" element={<CargaProduct />} />
              <Route path="/cargaProduct" element={<CargaProduct />} />
              <Route path="/ser-vendedor" element={<SerVendedor />} />
              <Route path="/serVendedor" element={<SerVendedor />} />
              <Route path="/editar-perfil" element={<EditarPerfil />} />
              <Route path="/mis-productos" element={<MisProductos />} />
              <Route path="/mis-compras" element={<MisCompras />} />
              <Route path="/mis-ventas" element={<MisVentas />} />
              <Route path="/user" element={<User />} />
              <Route path="/notifications" element={<Notis />} />
              <Route path="/notis" element={<Notis />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin/moderacion" element={<AdminModeracion />} />
                <Route path="/admin" element={<Navigate to="/admin/moderacion" replace />} />
                <Route path="/panel-admin" element={<Navigate to="/admin/moderacion" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {isLoggedIn && location.pathname !== "/contact" && <Contact />}
      <Analytics />
    </>
  );
}

export default App;