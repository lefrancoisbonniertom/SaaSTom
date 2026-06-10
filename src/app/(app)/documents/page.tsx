import { DocumentsWorkspace } from "@/components/documents-workspace";
import { PageHeader } from "@/components/page-header";

type DocumentsPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const { id } = await searchParams;

  return (
    <>
      <PageHeader
        description="Tous les brouillons créés par l'assistant sont regroupés ici."
        eyebrow="Documents"
        title="Retrouve les emails, devis et propositions générés."
      />
      <DocumentsWorkspace initialSelectedId={id ?? ""} key={id ?? "default"} />
    </>
  );
}
