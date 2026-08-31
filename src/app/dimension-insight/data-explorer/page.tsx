import { DemoNotice, PageHeader } from "../_components/ui-blocks";
import { DataExplorer } from "./_components/explorer";

export default function DataExplorerPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Data Explorer"
        title="Data explorer"
        description="Explore the analytics fact table by dimension and metric, with search, filtering, sorting, grouping, column visibility, date range and saved views."
      />
      <DataExplorer />
      <DemoNotice />
    </div>
  );
}
