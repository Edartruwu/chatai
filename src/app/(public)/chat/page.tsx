"use client";
import { ChatForm } from "@/components/chat/chat";
import { UserProfileForm } from "@/components/chat/userForm";
import { MainLayout } from "@/components/mainLayout";

export default function Page() {
  const chatUser: string | null = localStorage.getItem("chatUserData");
  if (!chatUser) {
    return (
      <MainLayout>
        <UserProfileForm />
      </MainLayout>
    );
  }
  if (chatUser !== null) {
    return (
      <MainLayout>
        <ChatForm />
      </MainLayout>
    );
  }
}
