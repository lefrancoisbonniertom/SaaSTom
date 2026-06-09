import { AssistantWorkspace } from "@/components/assistant-workspace";
import { PageHeader } from "@/components/page-header";

export default function AssistantPage() {
  return (
    <>
      <PageHeader
        description="Premiere version sans API externe : on simule les generations et on garde l'historique."
        eyebrow="Assistant IA"
        title="Transforme un brief en email, devis ou proposition."
      />
      <AssistantWorkspace />
    </>
  );
}
