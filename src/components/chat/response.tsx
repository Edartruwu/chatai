"use client";

import { useState } from "react";
import { MessageCircle, ExternalLink, Plus, User } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CompleteAnswerResponse } from "@/lib/chatLogic";
import ReactMarkdown from "react-markdown";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const S3_BASE_URL = "https://opd-peru.s3.us-east-1.amazonaws.com/data/";

function Source({
  citation,
  isMobile,
}: {
  citation: CompleteAnswerResponse["Citations"][0];
  isMobile: boolean;
}) {
  const sourceUrl = citation.RetrievedReferences[0]?.Location.S3Location?.Uri;
  const sourceText = citation.RetrievedReferences[0]?.Content.Text;

  const content = (
    <div className="space-y-2">
      <ScrollArea className="h-[200px] w-full">
        <p className="text-sm text-muted-foreground">{sourceText}</p>
      </ScrollArea>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-primary hover:underline mt-2"
        >
          View source <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            <MessageCircle className="mr-1 h-3 w-3" /> Source
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80">{content}</PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="cursor-help hover:bg-accent">
            <MessageCircle className="mr-1 h-3 w-3" /> Source
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-80">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Sources({
  citations,
}: {
  citations: CompleteAnswerResponse["Citations"];
}) {
  const [showAll, setShowAll] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const maxVisible = 3;

  const visibleCitations = showAll ? citations : citations.slice(0, maxVisible);
  const remainingCount = citations.length - maxVisible;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {visibleCitations.map((citation, index) => (
          <Source key={index} citation={citation} isMobile={isMobile} />
        ))}
        {!showAll && remainingCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs font-normal"
            onClick={() => setShowAll(true)}
          >
            <Plus className="mr-1 h-3 w-3" />
            {remainingCount}
          </Button>
        )}
      </div>
    </div>
  );
}

export function ResponseCard({ props }: { props: CompleteAnswerResponse }) {
  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/agent-avatar.png" alt="Agent Avatar" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            {/* eslint-disable @typescript-eslint/no-unused-vars */}
            <ReactMarkdown
              className="prose prose-sm dark:prose-invert"
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} className="text-primary hover:underline" />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    className="bg-muted px-1 py-0.5 rounded text-sm"
                  />
                ),
                pre: ({ node, ...props }) => (
                  <pre
                    {...props}
                    className="bg-muted p-2 rounded-md overflow-x-auto"
                  />
                ),
              }}
            >
              {props.Output.Text}
            </ReactMarkdown>
            {/* eslint-disable @typescript-eslint/no-unused-vars */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 pt-4">
        <div className="w-full space-y-2">
          <Sources citations={props.Citations} />
        </div>
      </CardFooter>
    </Card>
  );
}
