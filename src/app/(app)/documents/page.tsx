import { DocumentsWorkspace } from "@/components/documents-workspace";
import { PageHeader } from "@/components/page-header";

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        description="Tous les brouillons crees par l'assistant sont regroupes ici."
        eyebrow="Documents"
        title="Retrouve les emails, devis et propositions generes."
      />
      <DocumentsWorkspace />
    </>
  );
}
