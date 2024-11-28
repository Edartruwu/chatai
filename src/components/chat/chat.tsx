"use client";

import { useState, useRef, useEffect } from "react";
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

const MAX_CHARS: number = 500;
const SHOW_COUNTER_THRESHOLD: number = 400;

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

export function ChatForm(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { toast } = useToast();

  const messageLength: number = form.watch("message").length;
  const showCounter: boolean = messageLength >= SHOW_COUNTER_THRESHOLD;
  const isOverLimit: boolean = messageLength > MAX_CHARS;

  useEffect(
    function adjustTextareaHeight() {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          200,
        )}px`;
      }
    },
    [form.watch("message")],
  );

  useEffect(function loadStoredMessages() {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(
    function scrollToBottom() {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages],
  );

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    if (isOverLimit) {
      toast({
        title: "Error",
        description: `Message exceeds ${MAX_CHARS} characters. Please shorten your message.`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      const userMessage: Message = { type: "user", content: values.message };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const thinkingMessage: Message = {
        type: "thinking",
        content: "Thinking...",
      };
      setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

      form.reset();
      const userIdObject = localStorage.getItem("chatUserData");
      if (userIdObject === null) {
        throw new Error("no user id found");
      }
      const userId: string = JSON.parse(userIdObject).id;
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
      setMessages((prevMessages) => [...prevMessages.slice(0, -1), aiMessage]);

      localStorage.setItem(
        "chatMessages",
        JSON.stringify([...messages, userMessage, aiMessage]),
      );
    } catch (error) {
      toast({
        title: "Error",
        description: `${JSON.stringify(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  }

  return (
    <div className="w-full mx-auto flex flex-col h-screen">
      <ScrollArea
        className="flex-grow max-w-[800px] mx-auto w-full p-4"
        ref={scrollAreaRef}
      >
        {messages.map((message, index) => (
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
              <SkeletonResponse />
            ) : message.response ? (
              <ResponseCard props={message.response} />
            ) : (
              <div className="inline-block max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground">
                {message.content}
              </div>
            )}
          </div>
        ))}
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
                        placeholder="Send a message..."
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
                  {isLoading ? "Sending message" : "Send message"}
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
    </div>
  );
}
