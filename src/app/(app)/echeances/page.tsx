import type { Metadata } from "next";
import { CopilotWorkspace } from "@/components/copilot-workspace";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Mes échéances | Orfeo" };

export default function EcheancesPage() {
  return (
    <>
      <PageHeader
        description="Urssaf, CFE, impôts, TVA : toutes tes obligations de micro-entrepreneur, calculées pour ta situation et expliquées simplement."
        eyebrow="Copilote administratif"
        title="Tes échéances, sans stress."
      />
      <CopilotWorkspace />
    </>
  );
}
