import type { ReactNode } from "react";

import type { Metadata } from "next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { DimensionInsightHeader } from "./_components/dimension-insight-header";
import { DimensionInsightSidebar } from "./_components/dimension-insight-sidebar";

export const metadata: Metadata = {
  title: "DIMENSION INSIGHT — Business Intelligence & Executive Analytics Platform",
  description:
    "Frontend demonstration of an enterprise business intelligence and executive analytics platform using fictional data.",
};

export default function DimensionInsightLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <DimensionInsightSidebar />
      <SidebarInset className="min-w-0 overflow-x-clip">
        <DimensionInsightHeader />
        <div className="min-w-0 flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
