import { DocumentsWorkspace } from "@/components/documents-workspace";
import { PageHeader } from "@/components/page-header";

export default function DocumentsPage() {
  return (
    <>
      <PageHeader
        description="Tous les brouillons créés par l'assistant sont regroupés ici."
        eyebrow="Documents"
        title="Retrouve les emails, devis et propositions générés."
      />
      <DocumentsWorkspace />
    </>
  );
}
