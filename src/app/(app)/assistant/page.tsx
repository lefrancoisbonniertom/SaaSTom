import { AssistantWorkspace } from "@/components/assistant-workspace";
import { PageHeader } from "@/components/page-header";

export default function AssistantPage() {
  return (
    <>
      <PageHeader
        description="Decris ton besoin en quelques mots, SaaSTom redige le document en quelques secondes et l'enregistre dans ton historique."
        eyebrow="Assistant IA"
        title="Transforme un brief en email, devis ou proposition."
      />
      <AssistantWorkspace />
    </>
  );
}
