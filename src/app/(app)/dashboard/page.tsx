import { DashboardOverview } from "@/components/dashboard-overview";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        description="Vue d'ensemble des clients, documents et priorités pour piloter le MVP."
        eyebrow="Tableau de bord"
        title="Pilote ton activité avec un assistant IA."
      />
      <DashboardOverview />
    </>
  );
}
