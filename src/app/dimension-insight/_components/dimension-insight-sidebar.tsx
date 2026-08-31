"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Hexagon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { DIMENSION_INSIGHT_BASE, DIMENSION_INSIGHT_NAV } from "../_lib/navigation";

export function DimensionInsightSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isActive = (href: string) => pathname === href;
  const isBranchActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="DIMENSION INSIGHT">
              <Link href={DIMENSION_INSIGHT_BASE} onClick={() => setOpenMobile(false)}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Hexagon className="size-4" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-sm tracking-wide">DIMENSION INSIGHT</span>
                  <span className="truncate text-muted-foreground text-xs">Executive Analytics</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {DIMENSION_INSIGHT_NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.items ? isActive(item.href) : isBranchActive(item.href)}
                      tooltip={item.title}
                    >
                      <Link href={item.href} onClick={() => setOpenMobile(false)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.items ? (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton asChild isActive={isActive(subItem.href)}>
                              <Link href={subItem.href} onClick={() => setOpenMobile(false)}>
                                <subItem.icon className="size-3.5 opacity-70" />
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg border bg-sidebar-accent/40 p-3 text-xs group-data-[collapsible=icon]:hidden">
          <Badge variant="outline" className="mb-2">
            Demo build
          </Badge>
          <p className="text-muted-foreground leading-relaxed">
            Frontend demonstration using fictional data. No backend, database or live integrations.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
