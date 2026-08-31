import { AlertTriangle, CheckCircle2, ShieldAlert, Target } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KPIS, kpiStatus } from "@/data/dimension-insight/content";
import { formatNumber } from "@/data/dimension-insight/format";

import { PeriodControls } from "../_components/period-controls";
import { DemoNotice, KpiCard, KpiGrid, PageHeader } from "../_components/ui-blocks";
import { KpiLibrary } from "./_components/kpi-library";

const ON_TRACK = KPIS.filter((kpi) => kpiStatus(kpi) === "On Track");
const AT_RISK = KPIS.filter((kpi) => kpiStatus(kpi) === "At Risk");
const CRITICAL = KPIS.filter((kpi) => kpiStatus(kpi) === "Critical");

export default async function KpiCenterPage({ searchParams }: { searchParams: Promise<{ kpi?: string }> }) {
  const params = await searchParams;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="KPI Center"
        title="KPI center"
        description="The governed KPI library for the business, with current value, target, variance, movement, ownership and status for every measure."
        actions={<PeriodControls />}
      />

      <KpiGrid columns={4}>
        <KpiCard
          label="Tracked KPIs"
          value={formatNumber(KPIS.length)}
          icon={Target}
          footnote="Measures under formal governance"
        />
        <KpiCard
          label="On Track"
          value={formatNumber(ON_TRACK.length)}
          icon={CheckCircle2}
          progress={(ON_TRACK.length / KPIS.length) * 100}
          footnote="Within two percent of target or better"
        />
        <KpiCard
          label="At Risk"
          value={formatNumber(AT_RISK.length)}
          icon={AlertTriangle}
          footnote="Between two and ten percent below target"
        />
        <KpiCard
          label="Critical"
          value={formatNumber(CRITICAL.length)}
          icon={ShieldAlert}
          footnote="More than ten percent below target"
        />
      </KpiGrid>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-base">KPI library</CardTitle>
          <CardDescription className="text-xs">
            Search, filter and sort every governed measure. Select a row to open the KPI detail view.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <KpiLibrary initialKpiId={params.kpi} />
        </CardContent>
      </Card>

      <DemoNotice />
    </div>
  );
}
