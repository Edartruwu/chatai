"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { CompleteAnswerResponse } from "@/lib/chatLogic";
import { useState } from "react";

function Source({
  citation,
  isMobile,
}: {
  citation: CompleteAnswerResponse["Citations"][0];
  isMobile: boolean;
}) {
  const sourceUrl = citation.RetrievedReferences[0]?.Location.S3Location?.Uri;
  const sourceText = citation.RetrievedReferences[0]?.Content.Text;

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge variant="secondary" className="cursor-pointer">
            Source
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <ScrollArea className="h-[200px]">
            <p className="text-sm">{sourceText}</p>
          </ScrollArea>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-2 block"
            >
              View source
            </a>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="cursor-help">
            Source
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-80">
          <ScrollArea className="h-[200px]">
            <p className="text-sm">{sourceText}</p>
          </ScrollArea>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-2 block"
            >
              View source
            </a>
          )}
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
  const maxVisible = 4;

  if (citations.length <= maxVisible) {
    return (
      <div className="flex flex-wrap gap-2">
        {citations.map((citation, index) => (
          <Source key={index} citation={citation} isMobile={isMobile} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {citations
        .slice(0, showAll ? citations.length : maxVisible - 1)
        .map((citation, index) => (
          <Source key={index} citation={citation} isMobile={isMobile} />
        ))}
      {!showAll && (
        <Badge
          variant="secondary"
          className="cursor-pointer"
          onClick={() => setShowAll(true)}
        >
          +{citations.length - maxVisible + 1}
        </Badge>
      )}
    </div>
  );
}

export function ResponseCard({ props }: { props: CompleteAnswerResponse }) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Response</CardTitle>
      </CardHeader>
      <CardContent>{props.Output.Text}</CardContent>
      <CardFooter>
        <Sources citations={props.Citations} />
      </CardFooter>
    </Card>
  );
}
