"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FolderSyncIcon, Upload } from "lucide-react";
import MultipleFileUpload from "../upload/uploadMany";
import { syncKB } from "@/server/syncButton";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

function SyncButton() {
  const t = useTranslations("content");
  const { toast } = useToast();
  return (
    <Button
      onClick={async function () {
        try {
          await syncKB();
          toast({
            title: t("syncTitle"),
            description: t("syncDescription"),
          });
        } catch (error) {
          console.error(`${JSON.stringify(error)}`);
          toast({
            description: `${JSON.stringify(error)}`,
            variant: "destructive",
          });
        }
      }}
    >
      {t("syncButton")} <FolderSyncIcon />
    </Button>
  );
}

function UploadContent() {
  const t = useTranslations("content");
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("uploadContentTitle")}</CardTitle>
          <CardDescription>{t("uploadContentDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <MultipleFileUpload />
        </CardContent>
      </Card>
    </div>
  );
}

function UploadContentModal() {
  const t = useTranslations("content");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {t("uploadContentModal")} <Upload />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <UploadContent />
      </DialogContent>
    </Dialog>
  );
}

export { UploadContentModal, SyncButton };
