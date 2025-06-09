"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenManager } from "@/lib/tokenManager";
import { BASE_URL } from "@/lib/url";

interface AuthCallbackResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
    role: string;
    subscriptionType?: string;
  };
}

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<AuthCallbackResponse["user"] | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function processCallback() {
      try {
        setStatus("loading");

        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code || !state) {
          throw new Error("Missing authorization code or state");
        }

        // Call the backend callback endpoint
        const response = await fetch(
          `${BASE_URL}/login/google/callback?code=${code}&state=${state}`,
          {
            method: "GET",
            credentials: "include", // Important for the oauth_state cookie
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Authentication failed: ${response.status} - ${errorText}`,
          );
        }

        const data: AuthCallbackResponse = await response.json();

        // Store the JWT tokens
        TokenManager.storeTokens({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
          token_type: data.token_type,
        });

        setUser(data.user);
        setStatus("success");

        // Redirect based on user role/admin status
        setTimeout(() => {
          if (data.user.isAdmin || data.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 2000);
      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setError(
          error instanceof Error ? error.message : "Authentication failed",
        );
      }
    }

    processCallback();
  }, [searchParams, router]);

  const retryAuth = () => {
    window.location.href = "/auth";
  };

  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 h-screen w-screen">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {status === "loading" && "Authenticating..."}
            {status === "success" && "Authentication Successful!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-gray-600 dark:text-gray-300">
                Processing your authentication...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome, {user?.email}!
                </p>
                <p className="text-sm text-gray-500">
                  {user?.isAdmin
                    ? "Redirecting to admin dashboard..."
                    : "Redirecting to home..."}
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  {error || "Something went wrong during authentication."}
                </p>
                <Button onClick={retryAuth} className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
