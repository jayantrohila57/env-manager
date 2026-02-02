import Header from "@/components/header";
import Shell from "@/components/shell";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <Shell>
      <Shell.Header>
        <Header />
      </Shell.Header>
      <Shell.Main>{children}</Shell.Main>
    </Shell>
  );
}
