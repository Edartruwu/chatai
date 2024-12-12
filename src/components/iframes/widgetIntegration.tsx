"use client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";

import copy from "clipboard-copy";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

function CopyIframeButton() {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const iframeCode = `<iframe 
  src="https://odp-api.inedge.tech/integrations/widget" 
  style="position: fixed; bottom: 0; right: 0; width: 100%; height: 100%; border: none; z-index: 2147483647;">
</iframe>
`;

  const handleCopy = async () => {
    try {
      await copy(iframeCode);
      setIsCopied(true);
      toast({
        title: "¡Copiado!",
        description: "El código del iframe ha sido copiado a tu portapapeles.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(`${JSON.stringify(err)}`);
      toast({
        title: "Error",
        description: "No se pudo copiar. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Código del iframe</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
          <code>{iframeCode}</code>
        </pre>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy} variant="outline" className="w-full">
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Copiado
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" /> Copiar iframe
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function IframeTester() {
  return (
    <div>
      <Card className="w-full min-h-full">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CardTitle className="text-xl md:text-2xl">
            Aquí puedes visualizar algunos ejemplos de la integración
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Haz click a alguno de los botones para poder visualizar como se
            verían
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 justify-center">
          <CopyIframeButton />
          {/*
          <Card>
            <CardHeader>
              <CardTitle>
                Aquí puedes visualizar ejemplos de integración en ambas
                plataformas
              </CardTitle>
              <CardDescription>
                Haz click a uno de los botones para probarlo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 justify-center"></CardContent>
          </Card>
                    */}
        </CardContent>
      </Card>
    </div>
  );
}

function WidgetIframe() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center justify-center text-center">
        <CardTitle className="text-xl md:text-2xl">
          Iframe para Widget
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Esto es lo que verá tu usuario al integrar con el iframe
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-full max-w-[480px] aspect-[480/650] relative">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="/integrations/widget"
          />
        </div>
      </CardContent>
    </Card>
  );
}
export function WidgetIframeIntegration() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WidgetIframe />
        <IframeTester />
      </div>
    </section>
  );
}
