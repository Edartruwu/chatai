type ErrorResponse = { error: string };

type CompleteAnswerRequest = {
  userMessage: string;
  sessionID?: string;
};

type CompleteAnswerResponse = {};

type GeneratePresignedUrlRequest = {
  key: string;
};

type GeneratePresignedUrlResponse = {
  url: string;
};

type ListObjectsRequest = {
  pageSize: number;
  continuationToken?: string;
};

type ListObjectsResponse = {
  files: Array<any>; // Define based on the actual file object structure
  continuationToken?: string;
};

type DeleteObjectRequest = {
  key: string;
};

type DeleteObjectResponse = {
  message: string;
};

type SyncKnowledgeBaseResponse = {
  // Define based on `service.SyncKnowledgeBase` return type
};

export const BASE_URL = process.env.BACK_URL!;

// Helper function to handle API response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody: ErrorResponse = await response.json();
    throw new Error(errorBody.error);
  }
  return response.json();
}

// POST /chat/complete-answer
export async function completeAnswer(
  request: CompleteAnswerRequest,
): Promise<CompleteAnswerResponse> {
  const response = await fetch(`${BASE_URL}/chat/complete-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include", // Include cookies in the request
  });
  return handleResponse<CompleteAnswerResponse>(response);
}

// POST /generate-presigned-url
export async function generatePresignedUrl(
  request: GeneratePresignedUrlRequest,
): Promise<GeneratePresignedUrlResponse> {
  const response = await fetch(`${BASE_URL}/generate-presigned-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include", // Include cookies in the request
  });
  return handleResponse<GeneratePresignedUrlResponse>(response);
}

// GET /list-objects
export async function listObjects(
  request: ListObjectsRequest,
): Promise<ListObjectsResponse> {
  const url = new URL(`${BASE_URL}/list-objects`);
  url.searchParams.append("pageSize", request.pageSize.toString());
  if (request.continuationToken) {
    url.searchParams.append("continuationToken", request.continuationToken);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include", // Include cookies in the request
  });
  return handleResponse<ListObjectsResponse>(response);
}

// DELETE /delete-object
export async function deleteObject(
  request: DeleteObjectRequest,
): Promise<DeleteObjectResponse> {
  const response = await fetch(`${BASE_URL}/delete-object`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include", // Include cookies in the request
  });
  return handleResponse<DeleteObjectResponse>(response);
}

// POST /sync-knowledge-base
export async function syncKnowledgeBase(): Promise<SyncKnowledgeBaseResponse> {
  const response = await fetch(`${BASE_URL}/sync-knowledge-base`, {
    method: "POST",
    credentials: "include", // Include cookies in the request
  });
  return handleResponse<SyncKnowledgeBaseResponse>(response);
}
