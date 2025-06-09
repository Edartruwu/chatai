"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  BrainCircuit,
  Sparkles,
} from "lucide-react";

// Type definitions
interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

interface SidebarProps {
  navItems?: NavItem[];
  className?: string;
  defaultExpanded?: boolean;
}

// Default navigation items
const defaultNavItems: NavItem[] = [
  {
    title: "Linko",
    href: "/user",
    icon: BrainCircuit,
  },
  {
    title: "Settings",
    href: "/user/config",
    icon: Settings,
  },
];

// Status Card Component
function StatusCard({ expanded }: { expanded: boolean }) {
  // Mock data - in a real app these would come from API or state
  const usedAnswers = 65;
  const totalAnswers = 100;
  const planName = "Pro Plan";
  const percentUsed = Math.min(
    100,
    Math.round((usedAnswers / totalAnswers) * 100),
  );
  const remainingAnswers = totalAnswers - usedAnswers;

  if (!expanded) {
    // Compact version for collapsed sidebar
    return (
      <Card className="mx-auto w-12 h-8 mb-2">
        <CardContent className="p-1">
          <Progress value={percentUsed} className="h-1.5 mb-1" />
          <div className="flex justify-center">
            <Sparkles size={12} className="text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version for expanded sidebar
  return (
    <Card className="mb-2 shadow-sm border-muted">
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Linko AI</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
            <Sparkles size={10} />
            {planName}
          </span>
        </div>
        <Progress value={percentUsed} className="h-1.5" />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            {remainingAnswers} preguntas restantes
          </span>
          <span className="font-medium">
            {usedAnswers}/{totalAnswers}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function UserSidebar({
  navItems = defaultNavItems,
  className,
  defaultExpanded = true,
}: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <div className={cn("flex flex-col h-screen", className)}>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300",
          expanded ? "w-64" : "w-16",
        )}
      >
        <div className="flex h-14 items-center px-4 border-b">
          {expanded ? (
            <h1 className="font-semibold text-xl">Linko</h1>
          ) : (
            <div className="w-full flex justify-center">
              <span className="font-bold text-xl">
                <BrainCircuit />
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <TooltipProvider key={index} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                          item.disabled && "pointer-events-none opacity-60",
                        )}
                      >
                        <Icon size={expanded ? 18 : 20} />
                        {expanded && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {!expanded && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 mt-auto">
          {/* Status Card added here, above user profile */}
          <StatusCard expanded={expanded} />

          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            {expanded ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  E
                </div>
                <div>
                  <p className="text-sm font-medium">Eduardo Arhuata</p>
                  <p className="text-xs text-muted-foreground">
                    edartru@inedge.tech
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                E
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex h-14 items-center px-4 border-b">
            <h1 className="font-semibold text-xl">MyApp</h1>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
            <nav className="grid gap-1 p-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                      item.disabled && "pointer-events-none opacity-60",
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 mt-auto">
            {/* Status Card added here, above user profile in mobile view */}
            <StatusCard expanded={true} />

            <Separator className="my-2" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                E
              </div>
              <div>
                <p className="text-sm font-medium">Eduardo Arhuata</p>
                <p className="text-xs text-muted-foreground">
                  edartru@inedge.tech
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export { UserSidebar };
