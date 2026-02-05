import DashboardStats from "@/components/dashboard-stats";
import DashboardSection from "@/components/section-dashboard";
import Shell from "@/components/shell";

const header = {
  title: "Dashboard",
  description: "Overview of your environment manager statistics",
};

export default function DashboardPage() {
  return (
    <Shell>
      <Shell.Section variant="dashboard" padding="dashboard" scale="full">
        <DashboardSection {...header}>
          <DashboardStats />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  );
}
