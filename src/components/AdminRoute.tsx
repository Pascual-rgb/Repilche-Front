import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export const AdminRoute: React.FC = () => {
  const { user } = useAuthContext();
  const rawUser = user as any;
  const isAdmin =
    rawUser?.is_staff ||
    rawUser?.is_superuser ||
    rawUser?.role === "admin" ||
    rawUser?.es_admin;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;