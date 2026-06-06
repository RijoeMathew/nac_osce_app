import { Header } from "@/components/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fbfc]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
