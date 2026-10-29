import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

import { checkIsAdmin } from "../utils/auth";

export const AdminRoute: React.FC = () => {
  const { user, isLoggedIn } = useAuthContext();
  const isAdmin = checkIsAdmin(user);

  // Si no hay sesión activa ni token, redirigir al login
  if (!isLoggedIn && !localStorage.getItem("repilche-token")) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene permisos de staff/admin, redirigir al Home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;