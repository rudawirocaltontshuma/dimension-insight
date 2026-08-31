"use client";

import * as React from "react";

import { CalendarRange, Download, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { REGIONS } from "@/data/dimension-insight/dimensions";

const PERIODS = [
  "Last 30 days",
  "Last 90 days",
  "Last 6 months",
  "Last 12 months",
  "Fiscal year to date",
  "Trailing 24 months",
];

const SEGMENTS = ["All segments", "Enterprise", "Mid-Market", "Growth", "Startup", "Public Sector"];
const CURRENCIES = ["USD", "EUR", "GBP", "JPY"];

export function PeriodControls() {
  const [period, setPeriod] = React.useState("Last 12 months");
  const [region, setRegion] = React.useState("All regions");
  const [segment, setSegment] = React.useState("All segments");
  const [currency, setCurrency] = React.useState("USD");
  const [open, setOpen] = React.useState(false);

  const filterFields = (
    <>
      <div className="space-y-1.5">
        <Label htmlFor="dimension-insight-period">Reporting period</Label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger id="dimension-insight-period" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dimension-insight-region">Region</Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger id="dimension-insight-region" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All regions">All regions</SelectItem>
            {REGIONS.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dimension-insight-segment">Segment</Label>
        <Select value={segment} onValueChange={setSegment}>
          <SelectTrigger id="dimension-insight-segment" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEGMENTS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="dimension-insight-currency">Reporting currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id="dimension-insight-currency" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="hidden items-center gap-2 lg:flex">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger size="sm" className="w-48" aria-label="Reporting period">
            <CalendarRange className="size-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger size="sm" className="w-44" aria-label="Region">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All regions">All regions</SelectItem>
            {REGIONS.map((item) => (
              <SelectItem key={item.id} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <Filter className="size-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Analysis filters</SheetTitle>
            <SheetDescription>Adjust the reporting period and scope for this workspace.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-6">
            {filterFields}
            <Separator />
            <Button className="w-full" onClick={() => setOpen(false)}>
              Apply filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.success(`Workspace refreshed for ${period.toLowerCase()} · ${region}`)}
      >
        <RefreshCw className="size-4" />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast.success("Export queued", {
            description: `${period} · ${region} · ${segment} · ${currency}. Exports are simulated in this demo.`,
          })
        }
      >
        <Download className="size-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </div>
  );
}
