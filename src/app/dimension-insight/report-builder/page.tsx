import { DemoNotice, PageHeader } from "../_components/ui-blocks";
import { ReportBuilder } from "./_components/builder";

export default function ReportBuilderPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Report Builder"
        title="Report builder"
        description="Compose a report from a dataset, dimension, metric selection, chart type, filters, date range and layout. Every selection updates the live preview."
      />
      <ReportBuilder />
      <DemoNotice />
    </div>
  );
}
