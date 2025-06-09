import { z } from "zod";
import { BASE_URL } from "./url";
import { TokenManager } from "./tokenManager";

export const CompleteAnswerResponseSchema = z.object({
  Output: z.object({
    Text: z.string(),
  }),
  SessionId: z.string().uuid(),
  Citations: z.array(
    z.object({
      GeneratedResponsePart: z.object({
        TextResponsePart: z.object({
          Span: z.object({
            End: z.number(),
            Start: z.number(),
          }),
          Text: z.string(),
        }),
      }),
      RetrievedReferences: z.array(
        z.object({
          Content: z.object({
            Text: z.string(),
          }),
          Location: z.object({
            Type: z.string(),
            ConfluenceLocation: z.null(),
            S3Location: z.object({
              Uri: z.string().url(),
            }),
            SalesforceLocation: z.null(),
            SharePointLocation: z.null(),
            WebLocation: z.null(),
          }),
          Metadata: z.object({
            "x-amz-bedrock-kb-chunk-id": z.record(z.string()).optional(),
            "x-amz-bedrock-kb-data-source-id": z.record(z.string()).optional(),
            "x-amz-bedrock-kb-document-page-number": z
              .record(z.string())
              .optional(),
            "x-amz-bedrock-kb-source-uri": z.record(z.string()).optional(),
          }),
        }),
      ),
    }),
  ),
  GuardrailAction: z.string(),
  ResultMetadata: z.record(z.string()).optional(),
});

const UsageInfoSchema = z.object({
  requests_limit: z.string(),
  requests_remaining: z.string(),
  tier: z.string(),
});

const ChatResponseSchema = z.object({
  answer: CompleteAnswerResponseSchema,
  usage: UsageInfoSchema.optional(),
});

export type CompleteAnswerResponse = z.infer<
  typeof CompleteAnswerResponseSchema
>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type UsageInfo = z.infer<typeof UsageInfoSchema>;

interface CompleteAnswerRequest {
  userMessage: string;
  sessionId: string | null | undefined;
  userChatId: string;
}

interface ChatError {
  error: string;
  limit?: number;
  reset_time?: number;
  tier?: string;
  upgrade_message?: string;
}

export class RateLimitError extends Error {
  public readonly limit: number;
  public readonly resetTime: number;
  public readonly tier?: string;
  public readonly upgradeMessage?: string;

  constructor(
    message: string,
    limit: number,
    resetTime: number,
    tier?: string,
    upgradeMessage?: string,
  ) {
    super(message);
    this.name = "RateLimitError";
    this.limit = limit;
    this.resetTime = resetTime;
    this.tier = tier;
    this.upgradeMessage = upgradeMessage;
  }
}

export async function fetchCompleteAnswer(
  data: CompleteAnswerRequest,
): Promise<{
  response: CompleteAnswerResponse;
  usage?: UsageInfo;
  headers: Headers;
}> {
  const accessToken = TokenManager.getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authentication if available (for authenticated users vs anonymous)
  if (accessToken && !TokenManager.isTokenExpired()) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}/chat/complete-answer`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 429) {
      // Rate limit exceeded
      const errorData: ChatError = await response.json();
      throw new RateLimitError(
        errorData.error,
        errorData.limit || 0,
        errorData.reset_time || 0,
        errorData.tier,
        errorData.upgrade_message,
      );
    } else if (response.status === 401) {
      // Unauthorized - token might be expired
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        // Try to refresh token and retry
        try {
          const refreshResponse = await fetch(`${BASE_URL}/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            TokenManager.storeTokens({
              access_token: refreshData.access_token,
              refresh_token: refreshToken,
              expires_in: refreshData.expires_in,
              token_type: refreshData.token_type,
            });

            // Retry original request with new token
            const retryResponse = await fetch(
              `${BASE_URL}/chat/complete-answer`,
              {
                method: "POST",
                headers: {
                  ...headers,
                  Authorization: `Bearer ${refreshData.access_token}`,
                },
                body: JSON.stringify(data),
              },
            );

            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              const parsedData = ChatResponseSchema.parse(retryData);
              return {
                response: parsedData.answer,
                usage: parsedData.usage,
                headers: retryResponse.headers,
              };
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          TokenManager.clearTokens();
        }
      }
    }

    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const jsonData = await response.json();
  const parsedData = ChatResponseSchema.parse(jsonData);

  return {
    response: parsedData.answer,
    usage: parsedData.usage,
    headers: response.headers,
  };
}
