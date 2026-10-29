/**
 * Helper centralizado para verificar si el usuario actual posee permisos de administrador o staff.
 * 
 * Evalúa múltiples fuentes con tolerancia a tipos (boolean, string o número) y fallback
 * seguro al token JWT o a los datos persistidos en localStorage.
 */
export const checkIsAdmin = (user?: any): boolean => {
  // 1. Evaluación directa sobre el objeto de usuario provisto
  if (user) {
    if (
      user.is_staff === true ||
      user.is_staff === "true" ||
      user.is_staff === 1 ||
      user.is_superuser === true ||
      user.is_superuser === "true" ||
      user.is_superuser === 1 ||
      user.role === "admin" ||
      user.role === "staff" ||
      user.es_admin === true ||
      user.es_admin === "true"
    ) {
      return true;
    }
  }

  // 2. Fallback si user está vacío o desfasado en memoria: leer 'repilche-user' de localStorage
  try {
    const rawStored = localStorage.getItem("repilche-user");
    if (rawStored) {
      const parsed = JSON.parse(rawStored);
      if (
        parsed?.is_staff === true ||
        parsed?.is_staff === "true" ||
        parsed?.is_staff === 1 ||
        parsed?.is_superuser === true ||
        parsed?.is_superuser === "true" ||
        parsed?.is_superuser === 1 ||
        parsed?.role === "admin" ||
        parsed?.role === "staff" ||
        parsed?.es_admin === true ||
        parsed?.es_admin === "true"
      ) {
        return true;
      }
    }
  } catch {
    // Silencioso
  }

  // 3. Fallback al token JWT en 'repilche-token' (por si el backend inyectó los claims en el access token)
  try {
    const token = localStorage.getItem("repilche-token");
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        if (
          payload?.is_staff === true ||
          payload?.is_staff === "true" ||
          payload?.is_superuser === true ||
          payload?.is_superuser === "true" ||
          payload?.role === "admin" ||
          payload?.role === "staff" ||
          payload?.es_admin === true
        ) {
          return true;
        }
      }
    }
  } catch {
    // Silencioso
  }

  return false;
};
