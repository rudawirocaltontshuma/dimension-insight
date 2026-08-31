import type { ReactNode } from "react";

import type { Metadata } from "next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { NexoraHeader } from "./_components/nexora-header";
import { NexoraSidebar } from "./_components/nexora-sidebar";

export const metadata: Metadata = {
  title: "NEXORA INSIGHT — Business Intelligence & Executive Analytics Platform",
  description:
    "Frontend demonstration of an enterprise business intelligence and executive analytics platform using fictional data.",
};

export default function NexoraLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <NexoraSidebar />
      <SidebarInset className="min-w-0 overflow-x-clip">
        <NexoraHeader />
        <div className="min-w-0 flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
