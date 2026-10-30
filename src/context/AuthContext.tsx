import { createContext, useContext, useState, useEffect } from 'react';

export interface PerfilVendedorData {
  id?: number;
  alias?: string;
  alias_bancario?: string;
  locality?: string;
  llegoHasta?: string;
  description?: string;
  [key: string]: unknown;
}

export interface UserData {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  nombre?: string;
  apellido?: string;
  name?: string;
  lastName?: string;
  username?: string;
  usuario?: string;
  phone?: string;
  telefono?: string;
  numberPhone?: string;
  celphone?: string;
  avatar?: string;
  foto?: string;
  avatar_url?: string;
  image?: string;
  is_vendedor?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  role?: string;
  es_admin?: boolean;
  perfil?: PerfilVendedorData | null;
  perfil_vendedor?: PerfilVendedorData | null;
  [key: string]: unknown;
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
    () => localStorage.getItem('repilche-session') === 'true'
  );

  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('repilche-user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') return null;
      const perfilObj = parsed.perfil || parsed.perfil_vendedor || null;
      const avatarVal =
        parsed.avatar ||
        parsed.foto ||
        parsed.avatar_url ||
        parsed.image ||
        perfilObj?.avatar ||
        perfilObj?.foto ||
        '';
      return {
        ...parsed,
        name: parsed.name || parsed.first_name || parsed.username || '',
        lastName: parsed.lastName || parsed.last_name || '',
        first_name: parsed.first_name || parsed.name || '',
        last_name: parsed.last_name || parsed.lastName || '',
        username: parsed.username || parsed.email?.split('@')[0] || '',
        avatar: avatarVal,
        foto: avatarVal,
        avatar_url: avatarVal,
        image: avatarVal,
        is_vendedor: Boolean(parsed.is_vendedor),
        perfil: perfilObj,
        perfil_vendedor: perfilObj,
      };
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  const updateUser = (newUserData: Partial<UserData>) => {
    setUser((prev) => {
      const base = prev || ({} as UserData);
      const perfilObj =
        newUserData.perfil !== undefined
          ? newUserData.perfil
          : newUserData.perfil_vendedor !== undefined
          ? newUserData.perfil_vendedor
          : base.perfil || base.perfil_vendedor || null;

      const avatarVal =
        newUserData.avatar ||
        newUserData.foto ||
        (newUserData as any).avatar_url ||
        (newUserData as any).image ||
        base.avatar ||
        base.foto ||
        (base as any).avatar_url ||
        (base as any).image ||
        '';

      const updated: UserData = {
        ...base,
        ...newUserData,
        avatar: avatarVal,
        foto: avatarVal,
        avatar_url: avatarVal,
        image: avatarVal,
        perfil: perfilObj,
        perfil_vendedor: perfilObj,
      };
      localStorage.setItem('repilche-user', JSON.stringify(updated));
      return updated;
    });
  };

  // Sincronizar en segundo plano con el backend al recargar si hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem('repilche-token');
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';
    fetch(`${apiUrl}/usuario/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((meData) => {
        if (meData && typeof meData === 'object') {
          updateUser(meData);
        }
      })
      .catch((err) => {
        console.warn('No se pudo refrescar usuario/me en segundo plano:', err);
      });
  }, []);

  const login = async (datos: Record<string, unknown>) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

    const payload = {
      ...datos,
      username: datos.email || datos.username,
    };

    const response = await fetch(`${apiUrl}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('🔍 Error en login:', errorData);
      throw new Error('Credenciales inválidas o email no verificado');
    }

    const data = await response.json();
    if (data.access) {
      localStorage.setItem('repilche-token', data.access);
    }
    if (data.refresh) {
      localStorage.setItem('repilche-refresh', data.refresh);
    }

    let userObj = data.user;

    // Si el backend no devolvió el objeto usuario completo en login, lo obtenemos de /usuario/me/
    if (!userObj && data.access) {
      try {
        const meRes = await fetch(`${apiUrl}/usuario/me/`, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        if (meRes.ok) {
          userObj = await meRes.json();
        }
      } catch (err) {
        console.warn('No se pudo sincronizar usuario/me en login:', err);
      }
    }

    let tokenClaims: Record<string, any> = {};
    if (data.access) {
      try {
        const parts = data.access.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          tokenClaims = JSON.parse(decodeURIComponent(escape(atob(base64))));
        }
      } catch {
        // Silencioso
      }
    }

    if (userObj) {
      const perfilObj = userObj.perfil || userObj.perfil_vendedor || null;
      const avatarVal =
        userObj.avatar ||
        userObj.foto ||
        userObj.image ||
        userObj.avatar_url ||
        perfilObj?.avatar ||
        perfilObj?.foto ||
        '';
      const normalizedUser: UserData = {
        ...userObj,
        name: userObj.name || userObj.first_name || userObj.username || '',
        lastName: userObj.lastName || userObj.last_name || '',
        first_name: userObj.first_name || userObj.name || '',
        last_name: userObj.last_name || userObj.lastName || '',
        username: userObj.username || userObj.email?.split('@')[0] || '',
        avatar: avatarVal,
        foto: avatarVal,
        avatar_url: avatarVal,
        image: avatarVal,
        is_vendedor: Boolean(userObj.is_vendedor),
        is_staff: Boolean(userObj.is_staff ?? tokenClaims.is_staff),
        is_superuser: Boolean(userObj.is_superuser ?? tokenClaims.is_superuser),
        role: userObj.role || tokenClaims.role || undefined,
        perfil: perfilObj,
        perfil_vendedor: perfilObj,
      };
      localStorage.setItem('repilche-user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
    }

    localStorage.setItem('repilche-session', 'true');
    setIsLoggedIn(true);
  };

  const register = async (datos: Record<string, unknown>) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://repilche-backend.onrender.com/api';

    const response = await fetch(`${apiUrl}/registro/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('🔍 Respuesta de error del backend:', errorData);

      const mensajeError = errorData
        ? JSON.stringify(errorData, null, 2)
        : 'No se pudo completar el registro.';

      throw new Error(mensajeError);
    }

    const resData = await response.json().catch(() => null);
    if (resData?.access) {
      localStorage.setItem('repilche-token', resData.access);
    }
    if (resData?.refresh) {
      localStorage.setItem('repilche-refresh', resData.refresh);
    }
    if (resData?.user) {
      const perfilObj = resData.user.perfil || resData.user.perfil_vendedor || null;
      const avatarVal =
        resData.user.avatar ||
        resData.user.foto ||
        resData.user.image ||
        resData.user.avatar_url ||
        perfilObj?.avatar ||
        perfilObj?.foto ||
        '';
      const normalizedUser: UserData = {
        ...resData.user,
        name: resData.user.name || resData.user.first_name || resData.user.username || '',
        lastName: resData.user.lastName || resData.user.last_name || '',
        first_name: resData.user.first_name || resData.user.name || '',
        last_name: resData.user.last_name || resData.user.lastName || '',
        username: resData.user.username || resData.user.email?.split('@')[0] || '',
        avatar: avatarVal,
        foto: avatarVal,
        avatar_url: avatarVal,
        image: avatarVal,
        is_vendedor: Boolean(resData.user.is_vendedor),
        perfil: perfilObj,
        perfil_vendedor: perfilObj,
      };
      localStorage.setItem('repilche-user', JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      localStorage.setItem('repilche-session', 'true');
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    localStorage.removeItem('repilche-session');
    localStorage.removeItem('repilche-token');
    localStorage.removeItem('repilche-refresh');
    localStorage.removeItem('repilche-user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};