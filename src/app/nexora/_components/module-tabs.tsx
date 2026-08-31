"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { ANALYTICS_MODULES, NEXORA_BASE } from "../_lib/navigation";

const TABS = [{ title: "Overview", href: `${NEXORA_BASE}/analytics` }, ...ANALYTICS_MODULES];

export function ModuleTabs() {
  const pathname = usePathname();

  return (
    <ScrollArea className="w-full">
      <nav aria-label="Analytics modules" className="flex items-center gap-1 border-b pb-px">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "-mb-px whitespace-nowrap border-b-2 px-3 py-2 font-medium text-sm transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </nav>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
