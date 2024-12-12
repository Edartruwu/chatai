"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHelpCircleProps {
  size?: number;
}

export function ChatHelpCircle({
  size = 50,
}: ChatHelpCircleProps): JSX.Element | null {
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  function handleSettingsClick(): void {
    setIsButtonVisible(!isButtonVisible);
  }

  function handleDeleteAndReload(): void {
    localStorage.removeItem("chatSessionId");
    localStorage.removeItem("chatMessages");
    window.location.reload();
  }

  const content = (
    <div className="fixed right-4 z-[9999] top-4 sm:bottom-4 sm:top-auto">
      <div className="relative flex items-center">
        {isButtonVisible && (
          <Button
            variant="destructive"
            size="sm"
            className="mr-2 whitespace-nowrap"
            onClick={handleDeleteAndReload}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar chats
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-[25px] h-[25px] bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSettingsClick}
          aria-label={isButtonVisible ? "Hide settings" : "Show settings"}
        >
          <Settings size={size} />
        </Button>
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(content, document.body);
}
