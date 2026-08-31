import { DemoNotice, PageHeader } from "../_components/ui-blocks";
import { SettingsPanels } from "./_components/settings-panels";

export default function SettingsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Settings"
        title="Workspace settings"
        description="Appearance, dashboard defaults, notification routing, display formatting and analytics preferences. All settings are held in memory for this session."
      />
      <SettingsPanels />
      <DemoNotice />
    </div>
  );
}
