"use server";

import {
  CompleteAnswerResponse,
  fetchCompleteAnswer,
  RateLimitError,
  type UsageInfo,
} from "@/lib/chatLogic";

export interface getChatProps {
  userMessage: string;
  sessionId: string | null;
  userChatId: string;
}

export interface ChatResult {
  response: CompleteAnswerResponse;
  usage?: UsageInfo;
  rateLimitHeaders?: {
    limit: string;
    remaining: string;
    tier?: string;
  };
}

export async function getChat(params: getChatProps): Promise<ChatResult> {
  try {
    const result = await fetchCompleteAnswer({
      userMessage: params.userMessage,
      sessionId: params.sessionId,
      userChatId: params.userChatId,
    });

    // Extract rate limit information from headers
    const rateLimitHeaders = {
      limit: result.headers.get("X-RateLimit-Limit") || "unknown",
      remaining: result.headers.get("X-RateLimit-Remaining") || "unknown",
      tier: result.headers.get("X-RateLimit-Tier") || undefined,
    };

    return {
      response: result.response,
      usage: result.usage,
      rateLimitHeaders:
        rateLimitHeaders.limit !== "unknown" ? rateLimitHeaders : undefined,
    };
  } catch (error) {
    if (error instanceof RateLimitError) {
      // Re-throw rate limit errors with additional context
      throw error;
    }
    throw new Error(`Chat request failed: ${error}`);
  }
}
