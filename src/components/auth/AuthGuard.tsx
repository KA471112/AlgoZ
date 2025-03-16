import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/mockAuth";

interface AuthGuardProps {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we require authentication and the user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If we require admin privileges and the user is not an admin
  if (requireAdmin && (!user || !user.isAdmin)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If we don't require authentication but the user is logged in (for login/signup pages)
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
