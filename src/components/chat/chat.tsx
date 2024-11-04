"use client";

import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fetchCompleteAnswer } from "@/lib/chatLogic";
import { CompleteAnswerResponseSchema } from "@/lib/chatLogic";
import { ResponseCard } from "./response";

const formSchema = z.object({
  message: z.string().min(2, {
    message: "",
  }),
});

export function ChatForm() {
  let sessionId: string;
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiResponse, setApiResponse] = useState<z.infer<
    typeof CompleteAnswerResponseSchema
  > | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [form.watch("message")]);

  useEffect(() => {
    const storedResponse = localStorage.getItem("apiResponse");
    if (storedResponse) {
      const { response, timestamp } = JSON.parse(storedResponse);
      setApiResponse(response);
      console.log(
        `Last response stored at: ${new Date(timestamp).toLocaleString()}`,
      );
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const optimisticResponse = {
        Output: { Text: "Sending your message..." },
        SessionId: sessionId ?? "",
        Citations: [],
        GuardrailAction: "",
      };
      setApiResponse(optimisticResponse);
      const res = await fetchCompleteAnswer({
        userMessage: values.message,
        sessionId: sessionId ?? null,
      });
      const validatedResponse = CompleteAnswerResponseSchema.parse(res);
      sessionId = validatedResponse.SessionId;
      const storageItem = {
        response: validatedResponse,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("apiResponse", JSON.stringify(storageItem));
      setApiResponse(validatedResponse);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: `${JSON.stringify(error)}`,
        variant: "destructive",
      });
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full mx-auto">
      {apiResponse && <ResponseCard props={apiResponse} />}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[800px] flex flex-col items-center justify-center z-50 px-6 mb-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative w-full"
          >
            <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2 rounded-full bg-black hover:bg-gray-800 text-white"
              >
                <ArrowUp className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
