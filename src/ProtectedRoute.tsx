import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode; 
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/Profil" replace />;
  }
  return <>{children}</>; // fragment pour rendre les enfants
};

export default ProtectedRoute;
