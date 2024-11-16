import { z } from "zod";
import { BASE_URL } from "./url";

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

export type CompleteAnswerResponse = z.infer<
  typeof CompleteAnswerResponseSchema
>;

type CompleteAnswerRequest = {
  userMessage: string;
  sessionId: string | null | undefined;
};

export async function fetchCompleteAnswer(
  data: CompleteAnswerRequest,
): Promise<CompleteAnswerResponse> {
  const response = await fetch(`${BASE_URL}/chat/complete-answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response === undefined || response === null) {
    throw new Error("No response from Bedrock");
  }
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  const jsonData = await response.json();
  return CompleteAnswerResponseSchema.parse(jsonData);
}
