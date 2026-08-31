"use client";

import { Download, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ReportActions({ reportName }: { reportName: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.message(`${reportName} shared`, { description: "Sharing is simulated in this demo." })}
      >
        <Share2 className="size-4" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.message("Print layout prepared", { description: "Printing is simulated in this demo." })}
      >
        <Printer className="size-4" />
        Print
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast.success(`${reportName} export queued`, {
            description: "Exports are simulated. No file is generated in this demonstration.",
          })
        }
      >
        <Download className="size-4" />
        Export
      </Button>
    </div>
  );
}
