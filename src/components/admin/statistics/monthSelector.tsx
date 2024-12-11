"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function MonthSelector({ locale }: { locale: string }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(function () {
    const storedMonth = localStorage.getItem("selectedMonth");
    if (storedMonth) {
      setSelectedMonth(storedMonth);
    }
  }, []);

  function handleMonthChange(value: string): void {
    setSelectedMonth(value);
    localStorage.setItem("selectedMonth", value);
    window.location.reload();
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  function getCorrectLocale(locale: string): string {
    switch (locale) {
      case "en":
        return "en-US";
      case "es":
        return "es-ES";
      default:
        return "en-US";
    }
  }

  return (
    <div className="flex flex-row items-center justify-start">
      <p className="text-md min-w-[100px]">Ver data de:</p>
      <Select onValueChange={handleMonthChange} value={selectedMonth}>
        <SelectTrigger>
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, function (_, i): JSX.Element {
            const month = (i + 1).toString().padStart(2, "0");
            return (
              <SelectItem key={month} value={month}>
                {new Date(currentYear, i).toLocaleString(
                  getCorrectLocale(locale),
                  {
                    month: "long",
                  },
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
