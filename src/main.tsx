import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CarritoProvider } from "./context/CartContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CarritoProvider>
    </BrowserRouter>
  </StrictMode>
);