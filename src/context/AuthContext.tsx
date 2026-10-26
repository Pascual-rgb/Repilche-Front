import { createContext, useContext, useState } from "react";

export interface UserData {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  numberPhone?: string;
  celphone?: string;
  is_vendedor?: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (datos: Record<string, unknown>) => Promise<void>;
  register: (datos: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newUserData: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("repilche-session") === "true"
  );
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("repilche-user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);

  const updateUser = (newUserData: Partial<UserData>) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...newUserData } : (newUserData as UserData);
      localStorage.setItem("repilche-user", JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (datos: Record<string, unknown>) => {
    const apiUrl = import.meta.env.VITE_API_URL || "https://repilche-backend.onrender.com/api";

    const payload = {
      ...datos,
      username: datos.email || datos.username, 
    };

    // CORRECCIÓN: Cambiar /token/ por /login/ (o la ruta exacta de tu urls.py para LoginView)
    const response = await fetch(`${apiUrl}/login/`, {
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
    if (data.refresh) {
      localStorage.setItem("repilche-refresh", data.refresh);
    }
    if (data.user) {
      localStorage.setItem("repilche-user", JSON.stringify(data.user));
      setUser(data.user);
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
    localStorage.removeItem("repilche-refresh");
    localStorage.removeItem("repilche-user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, register, logout, updateUser }}>
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