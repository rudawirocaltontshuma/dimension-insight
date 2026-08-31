"use client";

import Link from "next/link";

import { CircleUser, LifeBuoy } from "lucide-react";
import { toast } from "sonner";

import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/header/theme-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { DIMENSION_INSIGHT_BASE } from "../_lib/navigation";
import { GlobalSearch } from "./global-search";

export function DimensionInsightHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-2 px-3 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 hidden data-[orientation=vertical]:h-4 sm:block" />
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden lg:inline-flex">
            Fictional data
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Platform help"
            className="hidden sm:inline-flex"
            onClick={() => toast.info("DIMENSION INSIGHT is a frontend demonstration using fictional data.")}
          >
            <LifeBuoy className="size-4" />
          </Button>
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Workspace menu">
                <Avatar className="size-7">
                  <AvatarFallback>EF</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm">Elena Ferraro</span>
                  <span className="text-muted-foreground text-xs">Chief Financial Officer</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`${DIMENSION_INSIGHT_BASE}/saved-views`}>Saved views</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${DIMENSION_INSIGHT_BASE}/settings`}>Workspace settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast.message("Account management is out of scope for this demo.")}>
                <CircleUser className="size-4" />
                About this demo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
