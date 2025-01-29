"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

function Hero() {
  return (
    <section
      id="hero"
      className="w-full max-w-[90vw] mx-auto border-4 border-black rounded-[50px] bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out mt-32 mb-8"
    >
      <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
        {/* Image Container */}
        <div className="relative w-full md:w-1/2 h-[450px] md:h-[550px]">
          <Image
            src="/LinkoAnimate.png" // Replace with your image path
            alt="Hero Image"
            fill
            className="object-contain"
            priority
            placeholder="empty"
          />
        </div>

        {/* CTA Content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Transforma tu investigación con una herramienta única
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-mono">
            Con Linko, facilita tu investigación sobre plataformas digitales
            peruanas, con una experiencia unica e intuitiva.
          </p>

          <div className="flex justify-center md:justify-start">
            <Button
              className="group rounded-[50px] px-8 py-6 text-lg bg-secondary hover:bg-secondary/90"
              variant="outline"
              size="lg"
            >
              Comenzar ahora
              <ArrowRightIcon className="w-6 h-6 ml-2 group-hover:-rotate-45 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Hero };
