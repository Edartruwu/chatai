"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
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

type Message = {
  type: "user" | "ai" | "thinking";
  content: string;
  response?: z.infer<typeof CompleteAnswerResponseSchema>;
};

const MemoResponseCard = memo(ResponseCard);
const MemoSkeletonResponse = memo(SkeletonResponse);
const MemoPresentationCard = memo(PresentationCard);

export function ChatForm(): JSX.Element {
  const t = useTranslations("mainChat");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const messageLength = form.watch("message").length;
  const showCounter = messageLength >= SHOW_COUNTER_THRESHOLD;
  const isOverLimit = messageLength > MAX_CHARS;

  // Textarea height adjustment
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [form.watch("message")]);

  // Initial message load
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  // Scroll to bottom effect
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = useCallback(
    function (event: React.KeyboardEvent<HTMLTextAreaElement>): void {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    },
    [form.handleSubmit],
  );

  const handleSuggestedQuestion = useCallback(
    function (question: string): void {
      form.setValue("message", question);
      form.handleSubmit(onSubmit)();
    },
    [form.setValue, form.handleSubmit],
  );

  const onSubmit = useCallback(
    async function (values: z.infer<typeof formSchema>): Promise<void> {
      if (isOverLimit) {
        toast({
          title: "Error",
          description: t("errorDescription", { maxChars: MAX_CHARS }),
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const userMessage: Message = { type: "user", content: values.message };

      try {
        setMessages((prev) => {
          const updated = [...prev, userMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });

        const thinkingMessage: Message = { type: "thinking", content: "" };
        setMessages((prev) => {
          const updated = [...prev, thinkingMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });

        form.reset();

        const userIdObject = localStorage.getItem("chatUserData");
        if (!userIdObject) throw new Error(t("noUserIdError"));

        const userId = JSON.parse(userIdObject).id;
        const chatSessionId = localStorage.getItem("chatSessionId");
        const res = await getChat({
          userChatId: userId,
          userMessage: values.message,
          sessionId: chatSessionId,
        });

        const validatedResponse = CompleteAnswerResponseSchema.parse(res);
        localStorage.setItem("chatSessionId", validatedResponse.SessionId);

        const aiMessage: Message = {
          type: "ai",
          content: validatedResponse.Output.Text,
          response: validatedResponse,
        };

        setMessages((prev) => {
          const updated = [...prev.slice(0, -1), aiMessage];
          localStorage.setItem("chatMessages", JSON.stringify(updated));
          return updated;
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `${error}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isOverLimit, toast, t, form.reset],
  );

  return (
    <div className="w-full mx-auto flex flex-col h-screen">
      <ScrollArea className="flex-grow max-w-[800px] mx-auto w-full p-4">
        {messages.length === 0 ? (
          <MemoPresentationCard onSuggestedQuestion={handleSuggestedQuestion} />
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
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
        <div ref={bottomRef} />
      </ScrollArea>

      <div className="w-full max-w-[800px] mx-auto px-4 mb-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
                        onFocus={() => setIsExpanded(true)}
                        onBlur={() => setIsExpanded(false)}
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
