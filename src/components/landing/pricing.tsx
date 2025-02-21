"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

function PricingSection() {
  const pricingTiers = [
    {
      name: "Básico",
      price: "Gratis",
      features: [
        "Acceso a información básica",
        "Consultas limitadas",
        "Soporte por correo electrónico",
      ],
      buttonText: "Comenzar gratis",
    },
    {
      name: "Pro",
      price: "S/. 99/mes",
      features: [
        "Acceso completo a la base de datos",
        "Consultas ilimitadas",
        "Soporte prioritario",
        "Análisis avanzados",
      ],
      buttonText: "Elegir Pro",
    },
    {
      name: "Empresa",
      price: "Personalizado",
      features: [
        "Solución personalizada",
        "Integración API",
        "Soporte dedicado",
        "Capacitación personalizada",
      ],
      buttonText: "Contactar ventas",
    },
  ];

  return (
    <section
      id="pricing"
      className="w-full max-w-[90vw] mx-auto border-4 border-black rounded-[50px] bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out my-8"
    >
      <div className="p-8 md:p-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-12">
          Planes de precios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className="border-2 border-black rounded-[30px] p-6 flex flex-col justify-between bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4">{tier.name}</h3>
                <p className="text-3xl font-bold mb-6">{tier.price}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                className="w-full rounded-[50px] py-6 text-lg bg-secondary hover:bg-secondary/90"
                variant="outline"
                size="lg"
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PricingSection };
