import { CompleteAnswerResponse } from "@/lib/chatLogic";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
function Citations({ props }: { props: CompleteAnswerResponse }) {
  return (
    <ScrollArea className="h-[69%]">
      <div>
        {props.Citations.map((citation, index) => (
          <div key={index} className="citation">
            <span>Citation {index + 1}</span>
            <span>
              <strong>Text Response:</strong>{" "}
              {citation.GeneratedResponsePart.TextResponsePart.Text}
            </span>
            {citation.RetrievedReferences.map((reference, refIndex) => (
              <div key={refIndex} className="reference">
                <span>
                  <strong>Reference Content:</strong> {reference.Content.Text}
                </span>
                {reference.Location.S3Location && (
                  <span>
                    <strong>Source URL:</strong>
                    <Link
                      href={reference.Location.S3Location.Uri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {reference.Location.S3Location.Uri}
                    </Link>
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function ChunkDialog({ props }: { props: CompleteAnswerResponse }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Badge>
          Ver fuentes <ArrowRight />
        </Badge>
      </DialogTrigger>
      <DialogContent className="w-[80%] h-[70%]">
        <DialogHeader>
          <DialogTitle>Fuentes de conocimiento:</DialogTitle>
          <DialogDescription>
            <Citations props={props} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export function ResponseCard({ props }: { props: CompleteAnswerResponse }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>response</CardTitle>
      </CardHeader>
      <CardContent>{props.Output.Text}</CardContent>
      <CardFooter>
        <ChunkDialog props={props} />
      </CardFooter>
    </Card>
  );
}
