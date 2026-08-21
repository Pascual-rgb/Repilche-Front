import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import { Home } from "./components/home";
import { ProductList } from "./components/ProductList";
import CargaProduct from "./components/CargaProduct";
import Contact from "./components/Contact";
import Login from "./components/LoginForm";
import User from "./components/User";
import Notis from "./components/Notis";
import SerVendedor from "./components/SerVendedorForm";
import { productos } from "./data/products";
import ProductoDetail from "./components/ProductoDetail";

function App() {
  return (
    <>
      <Header />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={<ProductList products={productos} />}
          />

          <Route
            path="/cargar-producto"
            element={<CargaProduct />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/user" element={<User />} />

          <Route path="/notifications" element={<Notis />} />

          <Route
            path="/ser-vendedor"
            element={<SerVendedor />}
          />

          <Route
            path="/producto/:id"
            element={<ProductoDetail />}
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Contact />
    </>
  );
}

export default App;