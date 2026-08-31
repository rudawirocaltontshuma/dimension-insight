import { DemoNotice, PageHeader } from "../_components/ui-blocks";
import { SavedViewGrid } from "./_components/saved-view-grid";

export default function SavedViewsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Saved Views"
        title="Saved views"
        description="Reusable analysis configurations across the executive dashboard and every analytics module. Views created here live for the current session only."
      />
      <SavedViewGrid />
      <DemoNotice />
    </div>
  );
}
