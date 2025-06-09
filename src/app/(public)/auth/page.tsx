"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "@/lib/url";
import { useAuth } from "@/components/auth/ProtectedRoute";
import { Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirecting, setRedirecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Handle URL error parameters
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        invalid_state: "Error de seguridad. Por favor, intenta de nuevo.",
        missing_code: "Error de autorización. Por favor, intenta de nuevo.",
        oauth_failed:
          "Error de autenticación con Google. Por favor, intenta de nuevo.",
        session_failed: "Error de sesión. Por favor, intenta de nuevo.",
        user_failed:
          "Error al obtener información del usuario. Por favor, intenta de nuevo.",
        token_failed: "Error al generar token. Por favor, intenta de nuevo.",
        refresh_failed:
          "Error al actualizar token. Por favor, intenta de nuevo.",
      };

      setAuthError(
        errorMessages[error] || "Error de autenticación desconocido.",
      );
    }
  }, [searchParams]);

  // Handle authenticated user redirection
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      setRedirecting(true);

      // Add a small delay to show the redirecting state
      const timer = setTimeout(() => {
        if (user.isAdmin || user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "linko-user") {
          router.push("/user");
        } else {
          // Fallback for unknown roles
          router.push("/");
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <main className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 h-screen w-screen">
        <Card className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-600 dark:text-gray-300">
              Verificando autenticación...
            </p>
          </div>
        </Card>
      </main>
    );
  }

  // Show redirecting state for authenticated users
  if (redirecting && isAuthenticated) {
    return (
      <main className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 h-screen w-screen">
        <Card className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-gray-900 dark:text-white font-semibold">
                ¡Bienvenido de vuelta!
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Redirigiendo...
              </p>
            </div>
          </div>
        </Card>
      </main>
    );
  }

  // Show login form for non-authenticated users
  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 h-screen w-screen">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        {/* Error Alert */}
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-2">
          <div className="flex justify-center py-4">
            <Image src="/opdlogo.svg" alt="OPD Logo" width={200} height={200} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ¡Bienvenido!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ingresa a tu cuenta para poder continuar
          </p>
        </div>

        <div className="pt-4">
          {/* Option 1: Direct link to backend (current approach) */}
          <Link href={`${BASE_URL}/login/google`} className="block w-full">
            <Button className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 py-6 text-lg rounded-xl shadow-md">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Ingresa con Google</span>
            </Button>
          </Link>

          {/* Option 2: Button with client-side handler (better error handling)
          <Button 
            onClick={handleGoogleAuth}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 py-6 text-lg rounded-xl shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <!-- Google icon paths -->
            </svg>
            <span>Ingresa con Google</span>
          </Button>
          */}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Ingresando aceptas los{" "}
          <Link
            href="/terms"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link
            href="/privacy"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Políticas de privacidad
          </Link>
        </div>
      </Card>
    </main>
  );
}
