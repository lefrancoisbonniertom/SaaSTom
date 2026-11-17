import type { ReactNode } from "react";

// Petits composants de mise en forme partagés par les guides
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 className="scroll-mt-24 pt-4 font-display text-2xl font-semibold text-ink" id={id}>
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 font-display text-lg font-semibold text-ink">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-7 text-ink-soft">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 leading-7 text-ink-soft marker:text-gold">{children}</ul>;
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-lg border border-gold/25 bg-gold/[0.07] p-5">
      <p className="font-semibold text-gold-soft">{title}</p>
      <div className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">{children}</div>
    </aside>
  );
}

export function Table({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className={`w-full text-left text-sm ${head.length > 2 ? "min-w-[520px]" : ""}`}>
        <thead className="bg-surface-raised text-ink">
          <tr>
            {head.map((h) => (
              <th className="px-4 py-3 font-semibold" key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-ink-soft">
          {rows.map((row, i) => (
            <tr className="bg-surface/60" key={i}>
              {row.map((cell, j) => (
                <td className="px-4 py-3 align-top" key={j}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      className="font-medium text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
      href={href}
      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
    >
      {children}
    </a>
  );
}
