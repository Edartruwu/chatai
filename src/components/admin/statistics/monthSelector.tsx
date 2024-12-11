"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface MonthYearSelectorProps {
  locale: string;
}

export function MonthSelector({ locale }: MonthYearSelectorProps): JSX.Element {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(function () {
    const storedMonth = localStorage.getItem("selectedMonth");
    const storedYear = localStorage.getItem("selectedYear");
    if (storedMonth) {
      setSelectedMonth(storedMonth);
    }
    if (storedYear) {
      setSelectedYear(storedYear);
    } else {
      const currentYear = new Date().getFullYear().toString();
      setSelectedYear(currentYear);
      localStorage.setItem("selectedYear", currentYear);
    }
  }, []);

  function handleMonthChange(value: string): void {
    setSelectedMonth(value);
    localStorage.setItem("selectedMonth", value);
    window.location.reload();
  }

  function handleYearChange(value: string): void {
    setSelectedYear(value);
    localStorage.setItem("selectedYear", value);
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

  function getVerText(locale: string): string {
    if (locale == "es") {
      return "Ver data de:";
    }
    if (locale == "en") {
      return "See data from:";
    }
    return "";
  }

  return (
    <div className="flex flex-row items-center justify-start space-x-4">
      <p className="text-md min-w-[100px]">{getVerText(locale)}</p>
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
      <Select onValueChange={handleYearChange} value={selectedYear}>
        <SelectTrigger>
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 5 }, function (_, i): JSX.Element {
            const year = (currentYear + i).toString();
            return (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
