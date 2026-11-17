import { CalendarClock, FileText, LayoutDashboard, Search, Sparkles, Users } from "lucide-react";
import { OrfeoLogo } from "@/components/orfeo-logo";

/** Reproduction fidèle (et fictive) du tableau de bord, pour la page d'accueil. */
export function ProductMockup() {
  const bars = [38, 62, 30, 74, 92, 48, 80];
  return (
    <div className="glass overflow-hidden rounded-[1.75rem] p-2 shadow-[0_60px_160px_-40px_rgba(214,178,110,0.35)]">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto rounded-lg bg-white/5 px-10 py-1 font-mono text-[11px] text-ink-muted">orfeo.digitaleweb.fr/dashboard</span>
      </div>
      <div className="grid grid-cols-[180px_1fr] gap-2 rounded-[1.3rem] bg-canvas/80 p-2 max-md:grid-cols-1">
        {/* menu */}
        <div className="hidden flex-col gap-1 rounded-2xl border border-white/5 bg-white/[0.02] p-3 md:flex">
          <div className="mb-3 flex items-center gap-2">
            <OrfeoLogo />
            <span className="font-display font-semibold">Orfeo</span>
          </div>
          {[
            [LayoutDashboard, "Tableau de bord", true],
            [CalendarClock, "Mes échéances", false],
            [Sparkles, "Assistant IA", false],
            [Users, "Clients", false],
            [FileText, "Documents", false],
          ].map(([Icon, label, active], i) => {
            const I = Icon as typeof LayoutDashboard;
            return (
              <div
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] ${active ? "bg-white/[0.06] text-ink" : "text-ink-muted"}`}
                key={i}
              >
                <I className={`size-3.5 ${active ? "text-gold" : ""}`} /> {label as string}
              </div>
            );
          })}
        </div>
        {/* contenu */}
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-[12px] text-ink-muted">
            <Search className="size-3.5" /> Rechercher un client, un document…
            <span className="btn-gold ml-auto rounded-lg px-2.5 py-1 text-[11px] font-semibold">Générer</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 rounded-2xl border border-white/5 bg-linear-to-br from-gold/10 to-transparent p-4">
              <p className="text-[11px] font-semibold text-gold">Studio IA</p>
              <p className="mt-1 font-display text-lg font-semibold">Que veux-tu envoyer aujourd&apos;hui ?</p>
              <div className="mt-3 h-12 rounded-xl border border-white/8 bg-canvas/70" />
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-[11px] font-semibold text-mint">Prochaine échéance</p>
              <p className="mt-1 font-display text-3xl font-semibold text-gold-soft">12 j</p>
              <p className="text-[11px] text-ink-muted">Déclaration Urssaf</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              ["Revenus suivis", "8 030 €", "text-mint"],
              ["Clients", "14", "text-sky"],
              ["Documents IA", "23", "text-gold"],
              ["Actions faites", "5/7", "text-coral"],
            ].map(([l, v, c]) => (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3" key={l}>
                <p className="text-[10px] text-ink-muted">{l}</p>
                <p className={`mt-1 text-base font-semibold ${c}`}>{v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[11px] font-semibold">Pipeline</p>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full">
                <div className="w-[20%] bg-ink-muted" />
                <div className="w-[25%] bg-coral" />
                <div className="w-[30%] bg-sky" />
                <div className="w-[25%] bg-mint" />
              </div>
              {["Maison Laurent · Signé", "Café Rivière · En cours", "Atelier Martin · À relancer"].map((r) => (
                <div className="mt-2 rounded-lg bg-white/[0.03] px-2 py-1.5 text-[11px] text-ink-soft" key={r}>
                  {r}
                </div>
              ))}
            </div>
            <div className="col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[11px] font-semibold">Activité</p>
              <div className="mt-3 flex h-20 items-end gap-1.5">
                {bars.map((h, i) => (
                  <div className="flex-1 rounded-md bg-linear-to-t from-gold-deep to-gold-soft" key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
