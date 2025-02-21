import { Button } from "@/components/ui/button";
import { TwitterIcon, LinkedinIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full max-w-[90vw] mx-auto border-4 border-black rounded-t-[50px] bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out mt-8">
      <div className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Linko</h3>
            <p className="text-muted-foreground">
              Tu asistente AI para investigación sobre plataformas digitales
              peruanas.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contáctanos</h4>
            <p className="text-muted-foreground">info@linko.pe</p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon">
                <TwitterIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LinkedinIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-muted-foreground">
          <p>&copy; 2023 Linko. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
