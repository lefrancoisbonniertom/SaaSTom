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
    <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
          {eyebrow}
        </p>
        <h2 className="mt-2 max-w-[calc(100vw-2rem)] break-words font-display text-2xl font-semibold tracking-normal text-ink sm:max-w-[calc(100vw-3rem)] sm:text-3xl xl:max-w-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[calc(100vw-2rem)] break-words text-sm leading-6 text-ink-muted sm:max-w-[calc(100vw-3rem)] xl:max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
