import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          <span className="h-px w-6 bg-linear-to-r from-transparent to-gold" />
          {eyebrow}
        </p>
        <h1 className="mt-3 break-words font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl xl:max-w-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl break-words text-[15px] leading-7 text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
