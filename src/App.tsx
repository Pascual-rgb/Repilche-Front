import { Routes, Route, BrowserRouter } from "react-router-dom";

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
    
      <BrowserRouter>
      <Header />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/notis" element={<Notis />} />
          <Route path="/serVendedor" element={<SerVendedor />} />
          <Route path="/cargaProduct" element={<CargaProduct />} />
          <Route path="/producto/:id" element={<ProductoDetail />} />
        </Routes>
      </main>
      </BrowserRouter>
  );
}

export default App;