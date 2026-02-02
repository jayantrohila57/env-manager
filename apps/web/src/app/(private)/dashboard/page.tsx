import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";

const header = {
  title: "Dashboard",
  description: "Manage your dashboard",
};

export default function DashboardPage() {
  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection {...header}>
          <div>Dashboard</div>
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
