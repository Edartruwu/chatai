"use server";

import { CHAT_API_KEY } from "@/lib/chatEnv";
import {
  CompleteAnswerResponse,
  CompleteAnswerResponseSchema,
} from "@/lib/chatLogic";
import { BASE_URL } from "@/lib/url";

export interface getChatProps {
  userMessage: string;
  sessionId: string | null;
  userChatId: string;
}

export async function getChat(
  params: getChatProps,
): Promise<CompleteAnswerResponse> {
  try {
    const response = await fetch(`${BASE_URL}/chat/complete-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${CHAT_API_KEY}`,
      },
      body: JSON.stringify(params),
    });

    if (response === undefined || response === null) {
      throw new Error("No response from Bedrock");
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const jsonData = await response.json();
    return CompleteAnswerResponseSchema.parse(jsonData);
  } catch (error) {
    throw new Error(`${JSON.stringify(error)}`);
  }
}

export interface ChatUsersParams {
  age: number;
  gender: string;
  ocupation: string;
}

export interface ChatUsersResponse {
  age: number;
  gender: string;
  ocupation: string;
  userID: string;
}
export async function ChatUsers(
  params: ChatUsersParams,
): Promise<ChatUsersResponse> {
  try {
    const response = await fetch(`${BASE_URL}/chat-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CHAT_API_KEY}`,
      },
      body: JSON.stringify(params),
    });

    if (response === undefined || response === null) {
      throw new Error("No response from Bedrock");
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const jsonData = await response.json();
    console.info(jsonData);
    return jsonData;
  } catch (error) {
    throw new Error(`${JSON.stringify(error)}`);
  }
}
