import { AlertTriangle, Bell, CheckCircle2, ShieldAlert } from "lucide-react";

import { ALERTS } from "@/data/nexora/content";
import { formatNumber } from "@/data/nexora/format";

import { DemoNotice, KpiCard, KpiGrid, PageHeader } from "../_components/ui-blocks";
import { AlertCenter } from "./_components/alert-center";

export default function AlertsPage() {
  const open = ALERTS.filter((alert) => alert.status === "Open");
  const critical = ALERTS.filter((alert) => alert.severity === "Critical" || alert.severity === "High");
  const resolved = ALERTS.filter((alert) => alert.status === "Resolved");

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Alerts"
        title="Analytics alerts"
        description="Threshold breaches and material movements detected across finance, sales, customers, operations, marketing and workforce metrics."
      />

      <KpiGrid columns={4}>
        <KpiCard
          label="Total alerts"
          value={formatNumber(ALERTS.length)}
          icon={Bell}
          footnote="Raised in the current cycle"
        />
        <KpiCard
          label="Open"
          value={formatNumber(open.length)}
          icon={AlertTriangle}
          footnote="Awaiting acknowledgement or action"
        />
        <KpiCard
          label="High severity"
          value={formatNumber(critical.length)}
          icon={ShieldAlert}
          footnote="Critical and high severity combined"
        />
        <KpiCard
          label="Resolved"
          value={formatNumber(resolved.length)}
          icon={CheckCircle2}
          progress={(resolved.length / ALERTS.length) * 100}
          footnote="Closed with an outcome recorded"
        />
      </KpiGrid>

      <AlertCenter />

      <DemoNotice />
    </div>
  );
}
