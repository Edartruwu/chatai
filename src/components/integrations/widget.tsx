"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";

interface WidgetClientProps {
  locale: string;
  color: string;
}

export function Widget({ locale, color }: WidgetClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function toggleWidget() {
    setIsOpen(!isOpen);
  }

  let title = "";

  if (locale == "es") {
    title == "Habla con Linko!";
  }
  if (locale == "en") {
    title == "Talk with Linko!";
  }

  return (
    <>
      <div className="fixed bottom-5 right-5" style={{ zIndex: 9999 }}>
        {isOpen && (
          <Card
            className={`
            absolute bottom-20 right-0 overflow-hidden shadow-2xl rounded-2xl
            ${isMobile ? "fixed inset-2 w-auto h-auto" : "w-[400px] h-[700px]"}
          `}
          >
            <div className="flex flex-col h-full">
              <div
                className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-800"
                style={{
                  background: `linear-gradient(to right, ${color}, ${adjustColor(color, -20)})`,
                }}
              >
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <Button
                  onClick={toggleWidget}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-blue-700"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <iframe
                src={`https://odp-api.inedge.tech/chat`}
                className="w-full p-0 md:p-4 flex-grow border-none"
              />
            </div>
          </Card>
        )}
        <div className="relative">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-md"
            style={{
              background: `linear-gradient(to right, ${adjustColor(color, 20)}, ${color})`,
            }}
          ></div>
          <Button
            onClick={toggleWidget}
            className="relative rounded-full w-16 h-16 shadow-lg text-white focus:ring-offset-2 focus:ring-2"
            size="icon"
            style={{ backgroundColor: color }}
          >
            {isOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <MessageCircle className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

function adjustColor(color: string, amount: number): string {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
}
