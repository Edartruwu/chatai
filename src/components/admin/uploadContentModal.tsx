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

function SyncButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={async function () {
        try {
          // await syncKB();
          toast({
            title: "Base de datos actualizada!",
            description:
              "Tu base de datos ahora contiene las nuevas fuentes de información",
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
      Syncroniza <FolderSyncIcon />
    </Button>
  );
}

function UploadContent() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sube nuevas fuentes de dato </CardTitle>
          <CardDescription>
            haz click o arrastra documentos para subirlos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultipleFileUpload />
        </CardContent>
      </Card>
    </div>
  );
}

function UploadContentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Subir contenido <Upload />
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
