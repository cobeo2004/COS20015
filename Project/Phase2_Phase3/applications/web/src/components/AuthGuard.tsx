import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { RiLoader4Line } from "@remixicon/react";

interface AuthGuardProps {
  requireAdmin?: boolean;
}

export function AuthGuard({ requireAdmin = true }: AuthGuardProps) {
  const { user, loading, isAdmin } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="h-12 w-12 text-blue-400 animate-spin" />
          <p className="text-blue-300 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Show access denied page if authenticated but not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-red-900">
        <div className="text-center text-white p-8 max-w-md">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-red-200 mb-6 text-lg">
            You don't have admin privileges to access this area.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = "/"}
              className="w-full block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-center"
            >
              ← Back to Role Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Allow access if authenticated and authorized
  return <Outlet />;
}
