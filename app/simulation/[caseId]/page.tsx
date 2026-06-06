import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { SimulationRoom } from "@/components/SimulationRoom";
import { getCaseById } from "@/lib/cases";

export default function SimulationPage({ params }: { params: { caseId: string } }) {
  const osceCase = getCaseById(params.caseId);

  if (!osceCase) {
    notFound();
  }

  return (
    <AppShell>
      <SimulationRoom osceCase={osceCase} />
    </AppShell>
  );
}
