"use client";

import * as React from "react";

import { Bell, BellOff, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALERTS, type AnalyticsAlert } from "@/data/nexora/content";
import { formatDate, formatSigned } from "@/data/nexora/format";
import { cn } from "@/lib/utils";

import { SEVERITY_ICON, SEVERITY_TONE, severityIconClass } from "../../_components/alert-list";
import { StatusPill } from "../../_components/ui-blocks";

const SEVERITIES = ["All severities", "Critical", "High", "Medium", "Low", "Info"];
const CATEGORIES = ["All categories", "Finance", "Sales", "Customers", "Operations", "Marketing", "Workforce"];

function statusTone(status: string) {
  if (status === "Resolved") return "positive" as const;
  return status === "Acknowledged" ? ("info" as const) : ("warning" as const);
}

export function AlertCenter() {
  const [severity, setSeverity] = React.useState("All severities");
  const [category, setCategory] = React.useState("All categories");
  const [statusTab, setStatusTab] = React.useState("all");
  const [acknowledged, setAcknowledged] = React.useState<Record<string, boolean>>({});

  const rows = React.useMemo(
    () =>
      ALERTS.filter((alert) => severity === "All severities" || alert.severity === severity)
        .filter((alert) => category === "All categories" || alert.category === category)
        .filter((alert) => {
          const effective = acknowledged[alert.id] ? "Acknowledged" : alert.status;
          if (statusTab === "all") return true;
          if (statusTab === "open") return effective === "Open";
          if (statusTab === "acknowledged") return effective === "Acknowledged";
          return effective === "Resolved";
        }),
    [severity, category, statusTab, acknowledged],
  );

  const acknowledge = (alert: AnalyticsAlert) => {
    setAcknowledged((current) => ({ ...current, [alert.id]: true }));
    toast.success(`${alert.id} acknowledged`, { description: alert.title });
  };

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={statusTab} onValueChange={setStatusTab}>
          <TabsList variant="line">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger size="sm" className="w-40" aria-label="Filter by severity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger size="sm" className="w-44" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.message("Alert subscriptions updated", {
                description: "Notification routing is simulated in this demonstration.",
              })
            }
          >
            <Bell className="size-4" />
            Subscriptions
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <BellOff className="size-6 text-muted-foreground" />
            <p className="font-medium text-sm">No alerts match these filters</p>
            <p className="max-w-sm text-muted-foreground text-xs">
              Adjust the severity, category or status filters to widen the search across the alert history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          {rows.map((alert) => {
            const Icon = SEVERITY_ICON[alert.severity];
            const status = acknowledged[alert.id] ? "Acknowledged" : alert.status;
            return (
              <Card key={alert.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-md",
                        severityIconClass(alert.severity),
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-snug">{alert.title}</CardTitle>
                      <CardDescription className="mt-1 text-xs leading-relaxed">{alert.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={alert.severity} tone={SEVERITY_TONE[alert.severity]} />
                    <StatusPill status={status} tone={statusTone(status)} />
                    <span className="text-muted-foreground text-xs">
                      {alert.category} · {alert.metric} · {formatDate(alert.date)}
                    </span>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        alert.change >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400",
                      )}
                    >
                      {formatSigned(alert.change)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" disabled={status !== "Open"} onClick={() => acknowledge(alert)}>
                      <Check className="size-4" />
                      {status === "Open" ? "Acknowledge" : status}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        toast.message(`${alert.id} investigation opened`, {
                          description: `${alert.metric} · ${alert.category}. Workflow actions are simulated.`,
                        })
                      }
                    >
                      Investigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
