import Image from "next/image";
import { Button } from "@/components/ui/button";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

function LinkoExplanation() {
  return (
    <section
      id="linko"
      className="w-full max-w-[90vw] mx-auto border-4 border-black rounded-[50px] bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out my-8"
    >
      <div className="flex flex-col md:flex-row-reverse items-center justify-between p-8 md:p-12 gap-8">
        {/* Image Container */}
        <div className="relative w-full md:w-1/2 h-[450px] md:h-[550px]">
          <Image
            src="/LinkoAssistant.png" // Replace with your Linko assistant image
            alt="Asistente Linko"
            fill
            className="object-contain"
            priority
            placeholder="empty"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Conoce a Linko: Tu asistente de investigación AI
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-mono">
            Linko es un asistente AI desarrollado por el Observatorio de
            Plataformas Peruanas para facilitar tus investigaciones. Responde a
            tus preguntas en español e inglés, brindándote información precisa
            sobre plataformas digitales peruanas.
          </p>

          <div className="flex justify-center md:justify-start">
            <Button
              className="group rounded-[50px] px-8 py-6 text-lg bg-secondary hover:bg-secondary/90"
              variant="outline"
              size="lg"
            >
              Haz una pregunta
              <QuestionMarkCircledIcon className="w-6 h-6 ml-2 group-hover:animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { LinkoExplanation };
