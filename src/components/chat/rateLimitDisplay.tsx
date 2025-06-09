"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Crown, Zap, Star } from "lucide-react";
import { getRateLimitInfo, type RateLimitInfo } from "@/lib/auth";
import { useTranslations } from "next-intl";

interface RateLimitUsage {
  requests_limit: string;
  requests_remaining: string;
  tier: string;
}

interface RateLimitDisplayProps {
  usage?: RateLimitUsage;
  className?: string;
}

export function RateLimitDisplay({ usage, className }: RateLimitDisplayProps) {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const t = useTranslations("rateLimit");

  useEffect(() => {
    async function fetchRateLimitInfo() {
      try {
        const info = await getRateLimitInfo();
        setRateLimitInfo(info);
      } catch (error) {
        console.error("Failed to fetch rate limit info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRateLimitInfo();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rateLimitInfo) return null;

  // Calculate usage from current request headers if available
  let remainingRequests: number | null = null;
  let totalRequests: number | null = null;
  let usagePercentage: number = 0;

  if (usage && usage.requests_limit !== "unlimited") {
    totalRequests = parseInt(usage.requests_limit);
    remainingRequests = parseInt(usage.requests_remaining);
    const usedRequests = totalRequests - remainingRequests;
    usagePercentage = (usedRequests / totalRequests) * 100;
  }

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case "Free Tier":
        return <Star className="h-4 w-4" />;
      case "Linko Plus":
        return <Zap className="h-4 w-4" />;
      case "Linko VIP":
        return <Crown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "Free Tier":
        return "bg-gray-100 text-gray-800";
      case "Linko Plus":
        return "bg-blue-100 text-blue-800";
      case "Linko VIP":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {rateLimitInfo.user_type === "admin" ? (
            <>
              <Crown className="h-4 w-4 text-yellow-500" />
              {t("adminAccess")}
            </>
          ) : rateLimitInfo.user_type === "anonymous" ? (
            <>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              {t("anonymousUser")}
            </>
          ) : (
            <>
              {getTierIcon(rateLimitInfo.subscription_tier)}
              {rateLimitInfo.subscription_tier || t("authenticatedUser")}
            </>
          )}
          {rateLimitInfo.subscription_tier && (
            <Badge className={getTierColor(rateLimitInfo.subscription_tier)}>
              {rateLimitInfo.subscription_tier}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rateLimitInfo.daily_limit === "unlimited" ? (
          <div className="text-sm text-green-600 font-medium">
            {t("unlimitedAccess")}
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span>{t("dailyLimit")}</span>
              <span className="font-medium">
                {remainingRequests !== null
                  ? `${remainingRequests}/${rateLimitInfo.daily_limit}`
                  : rateLimitInfo.daily_limit}{" "}
                {t("requests")}
              </span>
            </div>

            {remainingRequests !== null && totalRequests !== null && (
              <Progress value={usagePercentage} className="h-2" />
            )}

            {usagePercentage > 80 && (
              <div className="text-xs text-orange-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {t("approachingLimit")}
              </div>
            )}
          </>
        )}

        {rateLimitInfo.upgrade_message && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-2">
              {rateLimitInfo.upgrade_message}
            </p>
            <Button size="sm" className="w-full">
              {t("upgradeNow")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for extracting rate limit info from response headers
export function useRateLimitFromResponse() {
  const [usage, setUsage] = useState<RateLimitUsage | undefined>();

  const updateFromHeaders = (headers: Headers) => {
    const limit = headers.get("X-RateLimit-Limit");
    const remaining = headers.get("X-RateLimit-Remaining");
    const tier = headers.get("X-RateLimit-Tier");

    if (limit && remaining) {
      setUsage({
        requests_limit: limit,
        requests_remaining: remaining,
        tier: tier || "Unknown",
      });
    }
  };

  return { usage, updateFromHeaders };
}
