import type { CSSProperties, ReactNode } from "react";
import { Bot, CalendarClock, FileText, Mail, MessageSquareText, Receipt, Send, Users } from "lucide-react";
import { OrfeoLogo } from "@/components/orfeo-logo";

/* ───────────────────────── Orbites (inspiré de Magic UI, MIT) ───────────────────────── */

function Orbit({ radius, duration, reverse, children }: { radius: number; duration: number; reverse?: boolean; children: ReactNode[] }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
        style={{ width: radius * 2, height: radius * 2 }}
      />
      {children.map((child, i) => (
        <div
          className="absolute left-1/2 top-1/2 -ml-5 -mt-5 grid size-10 place-items-center"
          key={i}
          style={
            {
              "--radius": `${radius}px`,
              "--angle": (360 / children.length) * i,
              animation: `orfeo-orbit ${duration}s linear infinite${reverse ? " reverse" : ""}`,
            } as CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </>
  );
}

function Bubble({ children, tone = "text-gold" }: { children: ReactNode; tone?: string }) {
  return (
    <span className={`glass grid size-10 place-items-center rounded-full ${tone}`}>{children}</span>
  );
}

export function OrbitingTools() {
  return (
    <div className="relative mx-auto h-56 w-full max-w-[18rem] overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-6 rounded-full bg-gold/25 blur-2xl" />
        <OrfeoLogo size="lg" />
      </div>
      <Orbit duration={22} radius={54}>
        {[
          <Bubble key="a">
            <FileText className="size-4" />
          </Bubble>,
          <Bubble key="b" tone="text-mint">
            <Mail className="size-4" />
          </Bubble>,
        ]}
      </Orbit>
      <Orbit duration={34} radius={98} reverse>
        {[
          <Bubble key="c" tone="text-sky">
            <Users className="size-4" />
          </Bubble>,
          <Bubble key="d" tone="text-coral">
            <Receipt className="size-4" />
          </Bubble>,
          <Bubble key="e" tone="text-mint">
            <CalendarClock className="size-4" />
          </Bubble>,
          <Bubble key="f">
            <Bot className="size-4" />
          </Bubble>,
        ]}
      </Orbit>
    </div>
  );
}

/* ───────────────────────── Faisceaux animés (inspiré de Magic UI, MIT) ───────────────────────── */

const LEFT = [
  { y: 70, label: "Ton brief", sub: "quelques mots", icon: MessageSquareText },
  { y: 190, label: "Tes clients", sub: "pipeline", icon: Users },
  { y: 310, label: "Ta situation", sub: "date, activité", icon: CalendarClock },
];
const RIGHT = [
  { y: 70, label: "Devis prêt", sub: "PDF à envoyer", icon: FileText },
  { y: 190, label: "Relance envoyée", sub: "au bon moment", icon: Send },
  { y: 310, label: "Rappel Urssaf", sub: "3 jours avant", icon: CalendarClock },
];

/** Schéma : ce qui entre dans Orfeo → ce qui en sort, relié par des faisceaux lumineux. */
export function BeamFlow() {
  const cx = 500;
  const cy = 190;
  const curve = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  };
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <svg aria-hidden className="h-[300px] w-full sm:h-auto" preserveAspectRatio="none" viewBox="0 0 1000 380">
        <defs>
          <linearGradient id="beam-in" x1="0" x2="1">
            <stop offset="0%" stopColor="#5fe3b0" stopOpacity="0" />
            <stop offset="50%" stopColor="#5fe3b0" />
            <stop offset="100%" stopColor="#ecd39b" />
          </linearGradient>
          <linearGradient id="beam-out" x1="0" x2="1">
            <stop offset="0%" stopColor="#ecd39b" />
            <stop offset="60%" stopColor="#d6b26e" />
            <stop offset="100%" stopColor="#ff8a65" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {LEFT.map((n, i) => {
          const d = curve(250, n.y, cx - 60, cy);
          return (
            <g key={`l${i}`}>
              <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <path
                d={d}
                fill="none"
                stroke="url(#beam-in)"
                strokeDasharray="70 450"
                strokeLinecap="round"
                strokeWidth="2.5"
                style={{ animation: `orfeo-beam-dash 3.2s linear ${i * 0.5}s infinite` }}
              />
            </g>
          );
        })}
        {RIGHT.map((n, i) => {
          const d = curve(cx + 60, cy, 750, n.y);
          return (
            <g key={`r${i}`}>
              <path d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <path
                d={d}
                fill="none"
                stroke="url(#beam-out)"
                strokeDasharray="70 450"
                strokeLinecap="round"
                strokeWidth="2.5"
                style={{ animation: `orfeo-beam-dash 3.2s linear ${1.6 + i * 0.5}s infinite` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Nœuds en HTML, placés en pourcentage du schéma */}
      {LEFT.map((n) => (
        <Node align="left" icon={n.icon} key={n.label} label={n.label} sub={n.sub} x={25} y={(n.y / 380) * 100} />
      ))}
      {RIGHT.map((n) => (
        <Node align="right" icon={n.icon} key={n.label} label={n.label} sub={n.sub} x={75} y={(n.y / 380) * 100} />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -inset-8 animate-pulse rounded-full bg-gold/25 blur-2xl" />
        <span className="glass beam relative grid size-20 place-items-center rounded-3xl sm:size-28">
          <OrfeoLogo size="lg" />
        </span>
      </div>
    </div>
  );
}

function Node({
  x,
  y,
  label,
  sub,
  icon: Icon,
  align,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  icon: typeof Bot;
  align: "left" | "right";
}) {
  return (
    <div
      className={`glass absolute flex -translate-y-1/2 items-center gap-2.5 rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 ${
        align === "left" ? "-translate-x-full flex-row-reverse text-right" : ""
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${align === "left" ? "bg-mint/12 text-mint" : "bg-gold/12 text-gold"}`}>
        <Icon className="size-4" />
      </span>
      <span className="hidden sm:block">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        <span className="block text-xs text-ink-muted">{sub}</span>
      </span>
    </div>
  );
}
