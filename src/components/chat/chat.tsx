"use client";

import { useState, useRef, useEffect, useCallback, memo, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CompleteAnswerResponseSchema } from "@/lib/chatLogic";
import { ResponseCard } from "./response";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChat } from "@/server/chat/getChat";
import { SkeletonResponse } from "./response";
import { PresentationCard } from "./response";
import Link from "next/link";
import { useTranslations } from "next-intl";

const MAX_CHARS = 500;
const SHOW_COUNTER_THRESHOLD = 400;

const formSchema = z.object({
  message: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  id: string;
  type: "user" | "ai" | "thinking";
  content: string;
  response?: z.infer<typeof CompleteAnswerResponseSchema>;
};

// Memoized components to prevent unnecessary re-renders
const MemoResponseCard = memo(ResponseCard);
const MemoSkeletonResponse = memo(SkeletonResponse);
const MemoPresentationCard = memo(PresentationCard);

export function ChatForm(): JSX.Element {
  const t = useTranslations("mainChat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Form setup with better typing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const messageText = form.watch("message");

  // Memoized values to prevent recalculations on every render
  const messageLength = useMemo(() => messageText.length, [messageText]);
  const showCounter = useMemo(
    () => messageLength >= SHOW_COUNTER_THRESHOLD,
    [messageLength],
  );
  const isOverLimit = useMemo(() => messageLength > MAX_CHARS, [messageLength]);

  // Precise function to scroll only the ScrollArea viewport
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      // Target the ScrollAreaPrimitive.Viewport element specifically
      const viewport = scrollAreaRef.current.querySelector(
        'div[class*="h-full w-full rounded-"]',
      );

      if (viewport) {
        // Set scrollTop directly on the viewport element
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight;
        }, 50);
      }
    }
  }, []);

  // Textarea height adjustment
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [messageText]);

  // Initial message load - only runs once
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem("chatMessages");
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages) as Message[];
        // Ensure all messages have IDs
        const messagesWithIds = parsedMessages.map((msg) =>
          msg.id ? msg : { ...msg, id: crypto.randomUUID() },
        );
        setMessages(messagesWithIds);
      }
    } catch (error) {
      console.error("Failed to load stored messages:", error);
    }
  }, []);

  // Simplified effect to scroll to bottom when messages change - only affects ScrollArea
  useEffect(() => {
    if (messages.length > 0) {
      // Use requestAnimationFrame to ensure DOM has updated first
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages.length, scrollToBottom]);

  // Optimized function to save messages to localStorage
  const saveMessagesToStorage = useCallback((updatedMessages: Message[]) => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  }, []);

  // Optimized key handler with proper dependency array
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void form.handleSubmit(onSubmit)();
      }
    },
    [form],
  );

  // Optimized handler for suggested questions
  const handleSuggestedQuestion = useCallback(
    (question: string): void => {
      form.setValue("message", question);
      void form.handleSubmit(onSubmit)();
    },
    [form],
  );

  // Optimized submit handler with proper typing and error handling
  const onSubmit = useCallback(
    async (values: FormValues): Promise<void> => {
      if (isOverLimit) {
        toast({
          title: "Error",
          description: t("errorDescription", { maxChars: MAX_CHARS }),
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const userMessage: Message = {
        id: crypto.randomUUID(),
        type: "user",
        content: values.message,
      };

      try {
        // Update with user message
        setMessages((prev) => {
          const updated = [...prev, userMessage];
          saveMessagesToStorage(updated);
          return updated;
        });

        // Add thinking message
        const thinkingMessage: Message = {
          id: crypto.randomUUID(),
          type: "thinking",
          content: "",
        };

        setMessages((prev) => {
          const updated = [...prev, thinkingMessage];
          return updated;
        });

        form.reset();

        // Get user ID and session
        const userIdObject = localStorage.getItem("chatUserData");
        if (!userIdObject) throw new Error(t("noUserIdError"));

        const userData = JSON.parse(userIdObject) as { id: string };
        const chatSessionId = localStorage.getItem("chatSessionId");

        // Get chat response
        const res = await getChat({
          userChatId: userData.id,
          userMessage: values.message,
          sessionId: chatSessionId,
        });

        const validatedResponse = CompleteAnswerResponseSchema.parse(res);
        localStorage.setItem("chatSessionId", validatedResponse.SessionId);

        // Replace thinking message with AI response
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          type: "ai",
          content: validatedResponse.Output.Text,
          response: validatedResponse,
        };

        setMessages((prev) => {
          const updated = [...prev.slice(0, -1), aiMessage];
          saveMessagesToStorage(updated);
          return updated;
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });

        // Remove thinking message on error
        setMessages((prev) => {
          const updated = prev.filter((msg) => msg.type !== "thinking");
          saveMessagesToStorage(updated);
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isOverLimit, toast, t, form, saveMessagesToStorage],
  );

  // Only scroll when loading state changes from true to false (AI response finished)
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Small delay to ensure content is rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoading, messages.length, scrollToBottom]);

  return (
    <div
      className="w-full mx-auto flex flex-col h-full"
      style={{ display: "flex", flexDirection: "column", minHeight: "0" }}
    >
      <div
        className="flex-grow max-w-[800px] mx-auto w-full relative"
        style={{ minHeight: "0", height: "100%" }}
      >
        <ScrollArea
          ref={scrollAreaRef}
          className="h-full px-4 py-4"
          style={{ position: "absolute", inset: "0", overflow: "hidden" }}
        >
          {messages.length === 0 ? (
            <MemoPresentationCard
              onSuggestedQuestion={handleSuggestedQuestion}
            />
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.type === "user" ? (
                  <div className="inline-block max-w-[70%] p-3 rounded-lg bg-primary text-primary-foreground">
                    {message.content}
                  </div>
                ) : message.type === "thinking" ? (
                  <MemoSkeletonResponse />
                ) : message.response ? (
                  <MemoResponseCard props={message.response} />
                ) : (
                  <div className="inline-block max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground">
                    {message.content}
                  </div>
                )}
              </div>
            ))
          )}
          {/* This is the reference for scrolling to the bottom */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </ScrollArea>
      </div>

      <div className="w-full max-w-[800px] mx-auto px-4 mb-8">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit(onSubmit)();
            }}
            className="relative w-full"
          >
            <div className="relative flex items-center bg-muted rounded-lg overflow-hidden">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        placeholder={t("placeholder")}
                        className="resize-none overflow-y-auto transition-all duration-200 ease-in-out px-4 py-3 min-h-[52px] max-h-[200px] rounded-lg border-0 focus:ring-0 bg-transparent"
                        onKeyDown={handleKeyDown}
                        rows={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={messageLength === 0 || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isLoading ? t("sendingMessage") : t("sendMessage")}
                </span>
              </Button>
            </div>
            {showCounter && (
              <div
                className={`absolute -bottom-6 right-0 text-sm ${
                  isOverLimit ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {messageLength}/{MAX_CHARS}
              </div>
            )}
          </form>
        </Form>
      </div>

      <div className="text-center -mt-7">
        <Link
          href="https://inedge.tech"
          className="text-xs gap-1 text-muted-foreground hover:underline flex flex-row items-center justify-center"
        >
          {t("poweredBy")}
          <p className="text-xs text-muted-foreground underline">InEdge Labs</p>
        </Link>
      </div>
    </div>
  );
}
