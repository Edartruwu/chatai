"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import copy from "clipboard-copy";
import { Check, ComputerIcon, Copy, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function BigIframe() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center justify-center text-center">
        <CardTitle className="text-xl md:text-2xl">
          Iframe para computadora
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Esto es lo que verá tu usuario al integrar con el iframe
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-full max-w-[480px] aspect-[480/650] relative">
          <iframe className="absolute inset-0 w-full h-full" src="/chat" />
        </div>
      </CardContent>
    </Card>
  );
}

function CopyIframeButton() {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const iframeCode = `<iframe style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;" src="https://odp-chat.inedge.tech/chat"></iframe>`;

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

function BigScreenTester() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Ver ejemplo de Linko en desktop
          <ComputerIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] h-[95vh] max-w-none p-0 sm:w-[90vw] sm:h-[90vh]">
        <DialogTitle></DialogTitle>
        <ScrollArea className="h-full">
          <div className="flex flex-col min-h-full">
            <header className="p-4 border-b">
              <nav className="flex justify-between items-center">
                <h1 className="text-xl font-bold sm:text-2xl">
                  Linko - Observatorio de Plataformas Perú
                </h1>
                <div className="hidden sm:flex space-x-4">
                  <Button variant="ghost">Inicio</Button>
                  <Button variant="ghost">Sobre Nosotros</Button>
                  <Button variant="ghost">Investigaciones</Button>
                  <Button variant="ghost">Contacto</Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="sm:hidden">
                    <Button variant="outline" size="icon">
                      <Menu className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Inicio</DropdownMenuItem>
                    <DropdownMenuItem>Sobre Nosotros</DropdownMenuItem>
                    <DropdownMenuItem>Investigaciones</DropdownMenuItem>
                    <DropdownMenuItem>Contacto</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </header>

            <main className="flex-1 p-4 space-y-8">
              <section className="text-center space-y-4">
                <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                  Conoce a Linko: Tu Asistente de Investigación Digital
                </h2>
                <p className="text-lg text-muted-foreground sm:text-xl">
                  Potencia tus investigaciones sobre plataformas digitales en
                  Perú con inteligencia artificial
                </p>
              </section>

              <section className="w-full max-w-4xl mx-auto border rounded-lg shadow-lg overflow-hidden">
                <iframe className="w-full h-[50vh] sm:h-[60vh]" src="/chat" />
              </section>

              <section className="max-w-2xl mx-auto text-center space-y-4">
                <h3 className="text-xl font-semibold sm:text-2xl">
                  ¿Por qué utilizar Linko?
                </h3>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <li className="p-4 bg-secondary rounded-lg">
                    Acceso a datos actualizados de plataformas peruanas
                  </li>
                  <li className="p-4 bg-secondary rounded-lg">
                    Análisis de tendencias en tiempo real
                  </li>
                  <li className="p-4 bg-secondary rounded-lg">
                    Asistencia en la formulación de hipótesis
                  </li>
                  <li className="p-4 bg-secondary rounded-lg">
                    Generación de reportes personalizados
                  </li>
                </ul>
              </section>

              <section className="text-center space-y-4">
                <p className="text-base sm:text-lg">
                  Linko es una herramienta desarrollada por el Observatorio de
                  Plataformas Perú para facilitar la investigación sobre el
                  impacto de las plataformas digitales en la sociedad peruana.
                </p>
                <Button size="lg">
                  ¡Comienza tu investigación con Linko ahora!
                </Button>
              </section>
            </main>

            <Separator />

            <footer className="p-4 text-center text-xs sm:text-sm text-muted-foreground">
              © 2023 Observatorio de Plataformas Perú. Todos los derechos
              reservados.
            </footer>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function SmallScreenTester() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Ver ejemplo de Linko en móvil
          <Smartphone />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Así es como tus usuarios verán el chat de Linko en un teléfono móvil
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
              <iframe className="w-full h-full" src="/chat" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
            <CardContent className="flex flex-col gap-2 justify-center">
              <BigScreenTester />
              <SmallScreenTester />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export function BigIframeDisplayer() {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BigIframe />
        <IframeTester />
      </div>
    </section>
  );
}
