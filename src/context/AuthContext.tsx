import { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (datos: Record<string, unknown>) => Promise<void>;
  register: (datos: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("repilche-session") === "true"
  );
  const [isLoading] = useState(false);

  const login = async (datos: Record<string, unknown>) => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

    const payload = {
      ...datos,
      username: datos.email || datos.username, 
    };

    const response = await fetch(`${apiUrl}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("🔍 Error en login:", errorData);
      throw new Error("Credenciales inválidas o email no verificado");
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("repilche-token", data.access);
    }

    localStorage.setItem("repilche-session", "true");
    setIsLoggedIn(true);
  };

  const register = async (datos: Record<string, unknown>) => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

    const response = await fetch(`${apiUrl}/registro/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("🔍 Respuesta de error del backend:", errorData);
      
      const mensajeError = errorData 
        ? JSON.stringify(errorData, null, 2) 
        : "No se pudo completar el registro.";
        
      throw new Error(mensajeError);
    }
  };

  const logout = async () => {
    localStorage.removeItem("repilche-session");
    localStorage.removeItem("repilche-token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return context;
};