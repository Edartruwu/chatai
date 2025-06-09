"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, type User } from "@/lib/auth";
import { TokenManager } from "@/lib/tokenManager";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  fallbackPath = "/auth",
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Quick check if we have tokens
        if (!TokenManager.getAccessToken()) {
          router.push(fallbackPath);
          return;
        }

        const userData = await getUser();

        if (!userData) {
          router.push(fallbackPath);
          return;
        }

        // Check admin requirement
        if (requireAdmin && !userData.isAdmin && userData.role !== "admin") {
          router.push("/"); // Redirect to home if not admin
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push(fallbackPath);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, requireAdmin, fallbackPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

// Hook for using authentication state
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        if (!TokenManager.getAccessToken()) {
          setLoading(false);
          return;
        }

        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const logout = () => {
    TokenManager.clearTokens();
    setUser(null);
    window.location.href = "/";
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || user?.role === "admin",
    logout,
  };
}
