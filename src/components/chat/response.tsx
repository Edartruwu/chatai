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
import Link from "next/link";
import { convertS3UrlToBaseUrl } from "@/lib/s3UrlParser";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";

export const S3_BASE_URL = "https://opd-peru.s3.us-east-1.amazonaws.com/";

function Source({
  citation,
  isMobile,
}: {
  citation: CompleteAnswerResponse["Citations"][0];
  isMobile: boolean;
}) {
  const t = useTranslations("response");
  const sourceUrl = citation.RetrievedReferences[0]?.Location.S3Location?.Uri;
  const sourceText = citation.RetrievedReferences[0]?.Content.Text;

  const content = (
    <div className="space-y-2">
      <ScrollArea className="h-[200px] w-full">
        <p className="text-sm text-muted-foreground">{sourceText}</p>
      </ScrollArea>
      {sourceUrl && (
        <Link
          href={`${convertS3UrlToBaseUrl(sourceUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          prefetch={true}
          className="inline-flex items-center text-xs text-primary hover:underline mt-2"
        >
          {t("view-source")} <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            <MessageCircle className="mr-1 h-3 w-3" /> {t("source")}
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
            <MessageCircle className="mr-1 h-3 w-3" /> {t("source")}
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
  const t = useTranslations();
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
            onClick={function () {
              setShowAll(true);
            }}
          >
            <Plus className="mr-1 h-3 w-3" />
            {t("see-more")} ({remainingCount})
          </Button>
        )}
      </div>
    </div>
  );
}

export function ResponseCard({ props }: { props: CompleteAnswerResponse }) {
  const isMobile = useIsMobile();
  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start space-x-4">
          {!isMobile && (
            <Avatar className="w-10 h-10">
              <AvatarImage src="/zorrito.jpeg" alt="Agent Avatar" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          )}

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

export function SkeletonResponse() {
  const isMobile = useIsMobile();
  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start space-x-4">
          {!isMobile && (
            <Skeleton className="w-10 h-10 rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  <User className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </Skeleton>
          )}
          <div className="flex-1 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 pt-4">
        <div className="w-full space-y-2">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

interface PresentationCardProps {
  onSuggestedQuestion: (question: string) => void;
}

export function PresentationCard({
  onSuggestedQuestion,
}: PresentationCardProps): JSX.Element {
  const t = useTranslations("response");
  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardContent className="pt-4 pb-2 sm:pt-6 sm:pb-4">
        <div className="flex items-center sm:items-start space-x-3 sm:space-x-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src="/zorrito.jpeg" alt="Linko Avatar" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 sm:space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold leading-tight">
              {t("hello-intro")}
            </h2>
            <p className="text-sm sm:text-base">{t("ask-me-about")}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 pt-2 sm:pt-4">
        <div className="w-full space-y-2">
          {[t("question1"), t("question2"), t("question3")].map(
            (question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start text-xs sm:text-sm py-2 px-3 h-auto whitespace-normal"
                onClick={function () {
                  onSuggestedQuestion(question);
                }}
              >
                <span className="line-clamp-2 sm:line-clamp-none">
                  {question}
                </span>
              </Button>
            ),
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
