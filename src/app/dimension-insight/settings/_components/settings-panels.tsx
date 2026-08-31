"use client";

import * as React from "react";

import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
] as const;

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-0.5">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPanels() {
  const { themeMode, setPreference } = usePreferencesStore(
    useShallow((state) => ({ themeMode: state.values.theme_mode, setPreference: state.setPreference })),
  );

  const [landingPage, setLandingPage] = React.useState("Executive Dashboard");
  const [defaultPeriod, setDefaultPeriod] = React.useState("Last 12 months");
  const [density, setDensity] = React.useState("Comfortable");
  const [numberFormat, setNumberFormat] = React.useState("Compact");
  const [currency, setCurrency] = React.useState("USD");
  const [fiscalStart, setFiscalStart] = React.useState("January");
  const [comparison, setComparison] = React.useState("Prior year");
  const [decimals, setDecimals] = React.useState("One decimal");
  const [toggles, setToggles] = React.useState({
    alertEmails: true,
    thresholdPush: true,
    weeklyDigest: false,
    reportReady: true,
    showSparklines: true,
    showTargets: true,
    animateCharts: true,
    autoRefresh: false,
    anomalyDetection: true,
    forecasting: false,
  });

  const setToggle = (key: keyof typeof toggles, value: boolean, label: string) => {
    setToggles((current) => ({ ...current, [key]: value }));
    toast.message(`${label} ${value ? "enabled" : "disabled"}`, {
      description: "Preferences are held in memory for this session only.",
    });
  };

  return (
    <Tabs defaultValue="appearance" className="flex min-w-0 flex-col gap-4">
      <TabsList variant="line" className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="display">Display</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="appearance">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription className="text-xs">
              Choose how DIMENSION INSIGHT looks. The system option follows the operating system setting.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SettingRow title="Theme" description="Light, dark or matched to your system preference.">
              <div className="flex gap-2">
                {THEMES.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={themeMode === theme.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreference("theme_mode", theme.id)}
                  >
                    <theme.icon className="size-4" />
                    {theme.label}
                  </Button>
                ))}
              </div>
            </SettingRow>
            <SettingRow title="Interface density" description="Control padding and row height across tables and cards.">
              <Select value={density} onValueChange={setDensity}>
                <SelectTrigger size="sm" className="w-40" aria-label="Interface density">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Compact", "Comfortable", "Spacious"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Animate charts" description="Play the entry animation when a visualisation renders.">
              <Switch
                checked={toggles.animateCharts}
                onCheckedChange={(value) => setToggle("animateCharts", value, "Chart animation")}
              />
            </SettingRow>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dashboard">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Dashboard preferences</CardTitle>
            <CardDescription className="text-xs">
              Set where the workspace opens and how the executive dashboard is scoped by default.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SettingRow title="Landing page" description="The module opened when you enter the workspace.">
              <Select value={landingPage} onValueChange={setLandingPage}>
                <SelectTrigger size="sm" className="w-52" aria-label="Landing page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Executive Dashboard",
                    "Analytics Workspace",
                    "KPI Center",
                    "Data Explorer",
                    "Reports",
                    "Alerts",
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Default reporting period" description="Applied to every dashboard on first load.">
              <Select value={defaultPeriod} onValueChange={setDefaultPeriod}>
                <SelectTrigger size="sm" className="w-52" aria-label="Default reporting period">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Last 30 days", "Last 90 days", "Last 6 months", "Last 12 months", "Trailing 24 months"].map(
                    (item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Show targets on KPI cards" description="Overlay target attainment on every KPI card.">
              <Switch
                checked={toggles.showTargets}
                onCheckedChange={(value) => setToggle("showTargets", value, "Target overlay")}
              />
            </SettingRow>
            <SettingRow title="Auto refresh" description="Re-query the workspace on a fixed interval.">
              <Switch
                checked={toggles.autoRefresh}
                onCheckedChange={(value) => setToggle("autoRefresh", value, "Auto refresh")}
              />
            </SettingRow>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription className="text-xs">
              Choose which analytics events reach you and through which channel.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SettingRow title="Alert emails" description="Receive an email whenever a threshold alert is raised.">
              <Switch
                checked={toggles.alertEmails}
                onCheckedChange={(value) => setToggle("alertEmails", value, "Alert emails")}
              />
            </SettingRow>
            <SettingRow title="Threshold notifications" description="In-app notification for critical KPI breaches.">
              <Switch
                checked={toggles.thresholdPush}
                onCheckedChange={(value) => setToggle("thresholdPush", value, "Threshold notifications")}
              />
            </SettingRow>
            <SettingRow title="Weekly digest" description="A Monday summary of movement across every module.">
              <Switch
                checked={toggles.weeklyDigest}
                onCheckedChange={(value) => setToggle("weeklyDigest", value, "Weekly digest")}
              />
            </SettingRow>
            <SettingRow title="Report ready" description="Notify when a scheduled report finishes generating.">
              <Switch
                checked={toggles.reportReady}
                onCheckedChange={(value) => setToggle("reportReady", value, "Report ready notifications")}
              />
            </SettingRow>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="display">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Display</CardTitle>
            <CardDescription className="text-xs">
              Number formatting, currency and precision applied across charts and tables.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SettingRow title="Number format" description="Compact abbreviates large values, full shows every digit.">
              <Select value={numberFormat} onValueChange={setNumberFormat}>
                <SelectTrigger size="sm" className="w-40" aria-label="Number format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Compact", "Full", "Scientific"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Reporting currency" description="Presentation currency for all monetary measures.">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger size="sm" className="w-32" aria-label="Reporting currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["USD", "EUR", "GBP", "JPY"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Decimal precision" description="Precision used for percentages and ratios.">
              <Select value={decimals} onValueChange={setDecimals}>
                <SelectTrigger size="sm" className="w-40" aria-label="Decimal precision">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Whole numbers", "One decimal", "Two decimals"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Sparklines in tables" description="Show a twelve period sparkline beside trend columns.">
              <Switch
                checked={toggles.showSparklines}
                onCheckedChange={(value) => setToggle("showSparklines", value, "Table sparklines")}
              />
            </SettingRow>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Analytics preferences</CardTitle>
            <CardDescription className="text-xs">
              Calendar, comparison basis and the analytical services applied to your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SettingRow title="Fiscal year start" description="Anchors every year to date and quarter calculation.">
              <Select value={fiscalStart} onValueChange={setFiscalStart}>
                <SelectTrigger size="sm" className="w-40" aria-label="Fiscal year start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["January", "April", "July", "October"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow title="Default comparison" description="The baseline used for every variance calculation.">
              <Select value={comparison} onValueChange={setComparison}>
                <SelectTrigger size="sm" className="w-44" aria-label="Default comparison">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Prior period", "Prior year", "Budget", "Rolling average"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow
              title="Anomaly detection"
              description="Highlight statistically unusual movement on trend charts."
            >
              <Switch
                checked={toggles.anomalyDetection}
                onCheckedChange={(value) => setToggle("anomalyDetection", value, "Anomaly detection")}
              />
            </SettingRow>
            <SettingRow title="Forecast projections" description="Extend trend charts with a projected range.">
              <Switch
                checked={toggles.forecasting}
                onCheckedChange={(value) => setToggle("forecasting", value, "Forecast projections")}
              />
            </SettingRow>

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  toast.success("Preferences applied for this session", {
                    description: "Nothing is written to a server or database in this demonstration.",
                  })
                }
              >
                Save preferences
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setLandingPage("Executive Dashboard");
                  setDefaultPeriod("Last 12 months");
                  setDensity("Comfortable");
                  setNumberFormat("Compact");
                  setCurrency("USD");
                  setFiscalStart("January");
                  setComparison("Prior year");
                  setDecimals("One decimal");
                  toast.message("Preferences reset to the workspace defaults.");
                }}
              >
                Reset to defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
