"use client";

import * as React from "react";

import Link from "next/link";

import { ArrowUpRight, Bookmark, BookmarkCheck, Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SAVED_VIEWS, type SavedView } from "@/data/dimension-insight/content";
import { formatDate } from "@/data/dimension-insight/format";

const MODULES = [
  { label: "Executive Dashboard", href: "/dimension-insight/dashboard" },
  { label: "Sales Analytics", href: "/dimension-insight/analytics/sales" },
  { label: "Finance Analytics", href: "/dimension-insight/analytics/finance" },
  { label: "Customer Analytics", href: "/dimension-insight/analytics/customers" },
  { label: "Operations Analytics", href: "/dimension-insight/analytics/operations" },
  { label: "Marketing Analytics", href: "/dimension-insight/analytics/marketing" },
  { label: "Workforce Analytics", href: "/dimension-insight/analytics/workforce" },
  { label: "Data Explorer", href: "/dimension-insight/data-explorer" },
];

export function SavedViewGrid() {
  const [views, setViews] = React.useState<SavedView[]>(SAVED_VIEWS);
  const [pinned, setPinned] = React.useState<Record<string, boolean>>({ "view-executive-overview": true });
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [module, setModule] = React.useState(MODULES[0].label);
  const [description, setDescription] = React.useState("");

  const create = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      toast.warning("Give the view a name before saving it.");
      return;
    }
    const target = MODULES.find((entry) => entry.label === module) ?? MODULES[0];
    setViews((current) => [
      {
        id: `view-${current.length + 1}-${Date.now()}`,
        name: trimmed,
        module,
        href: target.href,
        description:
          description.trim().length > 0
            ? description.trim()
            : "Analysis configuration captured from the current workspace scope.",
        owner: "Elena Ferraro",
        updated: "2026-08-31",
        shared: false,
        filters: ["Period: Last 12 months", "Region: All"],
      },
      ...current,
    ]);
    setName("");
    setDescription("");
    setOpen(false);
    toast.success(`${trimmed} saved for this session`, {
      description: "Saved views are temporary and are not persisted in this demonstration.",
    });
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {views.length} views · {Object.values(pinned).filter(Boolean).length} pinned to the workspace
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              New saved view
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a saved view</DialogTitle>
              <DialogDescription>
                Capture the current analysis scope so it can be reopened later. State is temporary in this demo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="view-name">View name</Label>
                <Input
                  id="view-name"
                  value={name}
                  placeholder="Enterprise renewal watchlist"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="view-module">Module</Label>
                <Select value={module} onValueChange={setModule}>
                  <SelectTrigger id="view-module" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULES.map((item) => (
                      <SelectItem key={item.label} value={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="view-description">Description</Label>
                <Textarea
                  id="view-description"
                  value={description}
                  placeholder="What this view is for and who should use it."
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={create}>Save view</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {views.map((view) => (
          <Card key={view.id} className="flex flex-col overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <CardTitle className="text-base">{view.name}</CardTitle>
                  <CardDescription className="mt-1 text-xs leading-relaxed">{view.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={pinned[view.id] ? "Unpin view" : "Pin view"}
                  onClick={() => {
                    setPinned((current) => ({ ...current, [view.id]: !current[view.id] }));
                    toast.message(pinned[view.id] ? `${view.name} unpinned` : `${view.name} pinned`);
                  }}
                >
                  {pinned[view.id] ? (
                    <BookmarkCheck className="size-4 text-primary" />
                  ) : (
                    <Bookmark className="size-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {view.filters.map((filter) => (
                  <Badge key={filter} variant="outline" className="text-xs">
                    {filter}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>
                  {view.module} · {view.owner}
                </span>
                {view.shared ? (
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" />
                    Shared
                  </span>
                ) : (
                  <span>Private</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Updated {formatDate(view.updated)}</span>
                <Link href={view.href} className="inline-flex items-center gap-1 font-medium text-sm hover:underline">
                  Open
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
