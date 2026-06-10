import { ClientsWorkspace } from "@/components/clients-workspace";
import { PageHeader } from "@/components/page-header";

type ClientsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { q } = await searchParams;

  return (
    <>
      <PageHeader
        description="Ajoute des prospects, suis les montants et garde une prochaine action claire."
        eyebrow="CRM"
        title="Gère les clients et opportunités du SaaS."
      />
      <ClientsWorkspace initialQuery={q ?? ""} key={q ?? "all"} />
    </>
  );
}
