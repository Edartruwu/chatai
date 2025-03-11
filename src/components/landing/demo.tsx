"use client";

import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

function DemoWrapper() {
  return (
    <section
      id="demo"
      className="w-full max-w-[90vw] mx-auto border-4 border-black rounded-[50px] bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out my-8"
    >
      <div className="p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Prueba Linko ahora
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-mono">
            Tienes 3 preguntas gratuitas para explorar las capacidades de Linko
          </p>
        </div>

        <div className="bg-white border-2 border-black rounded-[30px] p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <iframe className="w-full h-[650px]" src="/chat"></iframe>
        </div>

        <div className="flex justify-center items-center space-x-2 text-sm text-muted-foreground">
          <InfoCircledIcon className="w-5 h-5" />
          <p>
            Después de 3 preguntas, necesitarás suscribirte para continuar
            usando Linko
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="#pricing">
            <Button
              className="group rounded-[50px] px-8 py-6 text-lg bg-secondary hover:bg-secondary/90"
              variant="outline"
              size="lg"
            >
              Ver planes de suscripción
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export { DemoWrapper };
