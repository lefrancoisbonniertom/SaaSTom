"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Progression (0 → 1) d'un élément pendant qu'il traverse l'écran. */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 quand le haut de l'élément entre par le bas, 1 quand il atteint le tiers haut de l'écran
      const p = (vh - r.top) / (vh * 0.75);
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { ref, progress };
}

/** Aperçu incliné en 3D qui se redresse au défilement. */
export function ScrollTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const eased = 1 - Math.pow(1 - progress, 3);
  return (
    <div className={className} ref={ref} style={{ perspective: "1600px" }}>
      <div
        style={{
          transform: `rotateX(${(1 - eased) * 28}deg) scale(${0.86 + eased * 0.14}) translateY(${(1 - eased) * 40}px)`,
          transformOrigin: "50% 0%",
          opacity: 0.35 + eased * 0.65,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Le hero s'estompe et recule légèrement quand on descend. */
export function HeroFade({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(window.scrollY / (window.innerHeight * 0.9), 1);
      el.style.opacity = String(1 - p * 0.85);
      el.style.transform = `translateY(${p * 60}px) scale(${1 - p * 0.04})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

/** Halo doré qui suit la souris sur toute la page (ordinateur seulement). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let tx = x;
    let ty = y;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
    };
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 size-[600px] rounded-full opacity-0 transition-opacity duration-700"
      ref={ref}
      style={{ background: "radial-gradient(circle, rgba(214,178,110,0.09), transparent 60%)" }}
    />
  );
}

const DEMOS: Array<[string, string]> = [
  [
    "Relance polie pour la facture n°24, envoyée il y a 10 jours",
    "Bonjour Madame Martin, je me permets de revenir vers vous au sujet de la facture n°24 du 7 novembre. Pourriez-vous me confirmer sa bonne réception ?",
  ],
  [
    "Proposition pour refaire le site d'une boulangerie",
    "Objet : votre nouveau site. Je vous propose un site vitrine clair, avec vos horaires, vos produits du jour et la commande en ligne de vos gâteaux.",
  ],
  [
    "Devis : logo + cartes de visite pour un coach sportif",
    "Devis n°2026-031 · Création du logo (3 pistes, 2 allers-retours) · Cartes de visite recto verso · Fichiers sources livrés.",
  ],
];

/** Démo de l'assistant : la demande, puis la réponse qui s'écrit. */
export function TypewriterDemo() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const holder = useRef<HTMLDivElement | null>(null);
  const visible = useRef(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => {
      visible.current = e.some((x) => x.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const full = DEMOS[index][1];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(full);
      return;
    }
    let i = 0;
    let timer = 0;
    const step = () => {
      if (!visible.current) {
        timer = window.setTimeout(step, 300);
        return;
      }
      i += 2;
      setTyped(full.slice(0, i));
      if (i < full.length) timer = window.setTimeout(step, 28);
      else timer = window.setTimeout(() => setIndex((n) => (n + 1) % DEMOS.length), 2600);
    };
    setTyped("");
    timer = window.setTimeout(step, 500);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <div className="mt-7 rounded-2xl border border-white/6 bg-canvas/70 p-4 text-[13px] leading-6" ref={holder}>
      <p className="flex items-start gap-2 text-ink-muted">
        <span className="mt-0.5 rounded-md bg-gold/15 px-1.5 text-[11px] font-semibold text-gold">Toi</span>
        <span key={index} className="animate-rise">{DEMOS[index][0]}</span>
      </p>
      <p className="mt-3 flex min-h-[4.5rem] items-start gap-2 text-ink-soft">
        <span className="mt-0.5 rounded-md bg-mint/15 px-1.5 text-[11px] font-semibold text-mint">Orfeo</span>
        <span>
          {typed}
          <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-gold" style={{ animation: "orfeo-caret 1s steps(1) infinite" }} />
        </span>
      </p>
      <div className="mt-3 flex gap-1.5">
        {DEMOS.map((_, i) => (
          <span className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-gold" : "w-2 bg-white/15"}`} key={i} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Texte qui s'allume au défilement ───────────────────────── */

export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(Math.min(Math.max(-r.top / (total || 1), 0), 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  const words = text.split(" ");
  return (
    <div className={`relative h-[220vh] ${className}`} ref={ref}>
      <div className="sticky top-0 flex h-screen items-center">
        <p className="mx-auto max-w-4xl px-5 font-display text-3xl font-semibold leading-[1.25] tracking-tight sm:text-5xl">
          {words.map((w, i) => {
            const start = i / words.length;
            const o = Math.min(Math.max((p * 1.15 - start) * words.length * 0.35, 0), 1);
            const gold = w.startsWith("*");
            return (
              <span key={i}>
                <span
                  className={`inline-block transition-[opacity,filter] duration-200 ${gold ? "text-shine" : ""}`}
                  style={{ opacity: 0.12 + o * 0.88, filter: `blur(${(1 - o) * 2}px)` }}
                >
                  {gold ? w.slice(1) : w}
                </span>{" "}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── Météores ───────────────────────── */

export function Meteors({ count = 18 }: { count?: number }) {
  const [items, setItems] = useState<Array<{ left: number; delay: number; duration: number }>>([]);
  useEffect(() => {
    setItems(
      Array.from({ length: count }, () => ({
        left: Math.random() * 110 - 5,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 5,
      })),
    );
  }, [count]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((m, i) => (
        <span
          className="absolute top-0 size-0.5 rounded-full bg-gold-soft shadow-[0_0_0_1px_rgba(255,255,255,0.08)] before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-1/2 before:bg-linear-to-r before:from-gold-soft before:to-transparent"
          key={i}
          style={{ left: `${m.left}%`, animation: `orfeo-meteor ${m.duration}s linear ${m.delay}s infinite` }}
        />
      ))}
    </div>
  );
}
