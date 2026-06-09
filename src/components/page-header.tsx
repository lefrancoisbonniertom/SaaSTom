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
    <header className="mb-6 flex flex-col gap-4 border-b border-[#dfe4d8] pb-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#66705f]">{eyebrow}</p>
        <h2 className="mt-1 max-w-[calc(100vw-2rem)] break-words text-2xl font-semibold tracking-normal sm:max-w-[calc(100vw-3rem)] sm:text-3xl xl:max-w-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[calc(100vw-2rem)] break-words text-sm leading-6 text-[#66705f] sm:max-w-[calc(100vw-3rem)] xl:max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
