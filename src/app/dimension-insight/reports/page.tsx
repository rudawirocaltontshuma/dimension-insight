import Link from "next/link";

import { ArrowUpRight, Eye, FileBarChart, FileClock, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EXECUTIVE_REPORT, REPORTS } from "@/data/dimension-insight/content";
import { formatDate, formatNumber } from "@/data/dimension-insight/format";

import { DemoNotice, KpiCard, KpiGrid, PageHeader } from "../_components/ui-blocks";
import { ReportLibrary } from "./_components/report-library";

export default function ReportsPage() {
  const published = REPORTS.filter((report) => report.status === "Published");
  const scheduled = REPORTS.filter((report) => report.status === "Scheduled");
  const totalViews = REPORTS.reduce((sum, report) => sum + report.views, 0);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Reports"
        title="Report library"
        description="Every published, scheduled, draft and archived analytical deliverable, with ownership, freshness and readership."
        actions={
          <Button asChild size="sm">
            <Link href="/dimension-insight/report-builder">
              <Wrench className="size-4" />
              Build a report
            </Link>
          </Button>
        }
      />

      <KpiGrid columns={4}>
        <KpiCard
          label="Reports"
          value={formatNumber(REPORTS.length)}
          icon={FileBarChart}
          footnote="Across all categories"
        />
        <KpiCard
          label="Published"
          value={formatNumber(published.length)}
          icon={FileBarChart}
          progress={(published.length / REPORTS.length) * 100}
          footnote="Currently available to their audience"
        />
        <KpiCard
          label="Scheduled"
          value={formatNumber(scheduled.length)}
          icon={FileClock}
          footnote="Awaiting their next delivery window"
        />
        <KpiCard
          label="Total views"
          value={formatNumber(totalViews)}
          icon={Eye}
          footnote="Readership across the library"
        />
      </KpiGrid>

      <Card className="overflow-hidden border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">Featured: {EXECUTIVE_REPORT.name}</CardTitle>
          <CardDescription className="text-xs">
            {EXECUTIVE_REPORT.description} Updated {formatDate(EXECUTIVE_REPORT.updated)} · {EXECUTIVE_REPORT.schedule}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={`/dimension-insight/reports/${EXECUTIVE_REPORT.id}`}
            className="inline-flex items-center gap-1 font-medium text-sm hover:underline"
          >
            Open the executive report
            <ArrowUpRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-base">All reports</CardTitle>
          <CardDescription className="text-xs">
            Search, filter and sort the library. Select a row to open the report.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ReportLibrary />
        </CardContent>
      </Card>

      <DemoNotice />
    </div>
  );
}
