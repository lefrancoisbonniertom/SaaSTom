import type { ReactNode } from "react";

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#17201b]">{title}</h1>
      <p className="mt-1 text-sm text-[#90a39a]">Dernière mise à jour : {updatedAt}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#17201b]">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-6 text-[#384438]">{children}</div>
    </section>
  );
}
