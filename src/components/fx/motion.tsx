"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from "react";

/** Apparition douce quand l'élément entre à l'écran. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  // Typé comme une div pour éviter une union de props trop complexe pour TypeScript
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.reveal = "in";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = "in";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    // Filet de sécurité : jamais de contenu caché indéfiniment
    const t = window.setTimeout(() => {
      if (el.dataset.reveal !== "in") el.dataset.reveal = "in";
    }, 2500 + delay);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [delay]);

  return (
    <Tag
      className={className}
      data-reveal=""
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Carte avec halo lumineux qui suit la souris. */
export function SpotlightCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  function onMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
    event.currentTarget.style.setProperty("--spot", "1");
  }
  function onLeave(event: MouseEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--spot", "0");
  }
  return (
    <div className={`spotlight ${className}`} onMouseLeave={onLeave} onMouseMove={onMove} style={style}>
      {children}
    </div>
  );
}

/** Inclinaison 3D légère au survol. */
export function Tilt({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  function onMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1100px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  }
  return (
    <div
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      ref={ref}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/** Nombre qui s'anime de 0 à sa valeur quand il devient visible. */
export function CountUp({
  value,
  duration = 1400,
  format = (n: number) => Math.round(n).toLocaleString("fr-FR"),
  className = "",
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      if (started.current) return;
      started.current = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        setShown(value);
        return;
      }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setShown(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) run();
    });
    io.observe(el);
    const fallback = window.setTimeout(() => {
      if (!started.current) {
        started.current = true;
        setShown(value);
      }
    }, 2500);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
  }, [value, duration]);

  // Si la valeur change après l'animation, on l'affiche directement
  useEffect(() => {
    if (started.current) setShown(value);
  }, [value]);

  return (
    <span className={className} ref={ref}>
      {format(shown)}
    </span>
  );
}

/** Petite courbe (sparkline) animée. */
export function Sparkline({
  data,
  className = "",
  stroke = "var(--color-gold)",
}: {
  data: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 120;
  const h = 36;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / Math.max(data.length - 1, 1)) * w,
    h - 4 - ((v - min) / span) * (h - 8),
  ]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  const id = `spark-${data.join("-")}`;
  return (
    <svg aria-hidden className={className} preserveAspectRatio="none" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path className="draw-line" d={d} fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
