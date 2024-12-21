"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { useLocale } from "next-intl";
import { setCookie } from "cookies-next";

type Language = "en" | "es";

function getLanguageName(lang: Language): string {
  const languageNames: Record<Language, string> = {
    en: "English",
    es: "Español",
  };
  return languageNames[lang];
}

export function HelpCircle(): JSX.Element | null {
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const localActive = useLocale() as Language;
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(localActive);

  useEffect(function (): () => void {
    setIsMounted(true);
    return function (): void {
      setIsMounted(false);
    };
  }, []);

  function handleMenuToggle(): void {
    setIsMenuVisible(!isMenuVisible);
  }

  function handleLanguageChange(value: string): void {
    const nextLocale = value as Language;
    setSelectedLanguage(nextLocale);
    setCookie("locale", nextLocale, { maxAge: 60 * 60 * 24 * 365 });
    window.location.reload();
  }

  const content: JSX.Element = (
    <div className="fixed right-4 z-[9999] top-4 flex flex-col items-end space-y-2">
      {isMenuVisible && (
        <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg space-y-2">
          <div className="w-full">
            <Select
              defaultValue={localActive}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger
                id="language"
                className="w-full bg-primary-foreground text-primary"
              >
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select Language">
                  {getLanguageName(selectedLanguage)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="bg-primary-foreground z-[9999] text-primary"
              >
                <SelectItem className="focus:bg-primary/10" value="en">
                  English
                </SelectItem>
                <SelectItem className="focus:bg-primary/10" value="es">
                  Español
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-[25px] h-[25px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        onClick={handleMenuToggle}
        aria-label={isMenuVisible ? "Hide menu" : "Show menu"}
      >
        <Settings size={24} />
      </Button>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(content, document.body);
}
