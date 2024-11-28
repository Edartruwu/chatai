"use server";
import { UserFormValues } from "@/components/chat/userForm";
import { BASE_URL } from "@/lib/url";
import { CHAT_API_KEY } from "@/lib/chatEnv";

interface ChatUser {
  age: number;
  gender: string;
  ocupation: string;
}

export interface NewChatUserResponse {
  id: string;
  age: number;
  gender: string;
  ocupation: string;
}

export async function addNewUser(
  params: UserFormValues,
): Promise<NewChatUserResponse> {
  try {
    const body: ChatUser = {
      age: params.edad,
      gender: params.genero,
      ocupation: params.ocupacion,
    };

    const res = await fetch(`${BASE_URL}/chat-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${CHAT_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    throw new Error(`Error in addNewUser: ${JSON.stringify(error)}`);
  }
}
