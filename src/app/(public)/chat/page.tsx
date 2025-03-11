"use client";

import { useEffect, useState } from "react";
import { ChatForm } from "@/components/chat/chat";
import { UserProfileForm } from "@/components/chat/userForm";
import { MainLayout } from "@/components/mainLayout";
import { ChatHelpCircle } from "@/components/chat/deleteData";
import { HelpCircle } from "@/components/help-circle";

export default function ChatPage() {
  const [chatUser, setChatUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    const userData = localStorage.getItem("chatUserData");
    setChatUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!chatUser) {
    return (
      <MainLayout>
        <HelpCircle />
        <UserProfileForm />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ChatHelpCircle />
      <ChatForm />
    </MainLayout>
  );
}
