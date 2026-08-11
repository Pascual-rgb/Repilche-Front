import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./components/Home";
import Contact from "./components/Contact";
import LoginForm from "./components/LoginForm";
import RegistroForm from "./components/RegistroForm";
import SerVendedorForm from "./components/SerVendedorForm";
import CargaProduct from "./components/CargaProduct";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<RegistroForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/serVendedor" element={<SerVendedorForm />} />
        <Route path="/cargaProduct" element={<CargaProduct />} />
      </Routes>

      <Contact />
    </>
  );
}

export default App;