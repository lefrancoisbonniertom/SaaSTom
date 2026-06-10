import { ClientsWorkspace } from "@/components/clients-workspace";
import { PageHeader } from "@/components/page-header";

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        description="Ajoute des prospects, suis les montants et garde une prochaine action claire."
        eyebrow="CRM"
        title="Gère les clients et opportunités du SaaS."
      />
      <ClientsWorkspace />
    </>
  );
}
