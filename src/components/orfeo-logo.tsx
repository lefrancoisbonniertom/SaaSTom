/** Logo Orfeo : un cœur doré et son orbite. */
export function OrfeoLogo({ size = "md", className = "" }: { size?: "md" | "lg"; className?: string }) {
  const px = size === "lg" ? 44 : 32;
  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-xl bg-linear-to-br from-gold-soft via-gold to-gold-deep shadow-[0_8px_24px_-6px_rgba(214,178,110,0.6),inset_0_1px_0_rgba(255,255,255,0.5)] ${className}`}
      style={{ width: px, height: px }}
    >
      <svg aria-hidden fill="none" height={px * 0.62} viewBox="0 0 24 24" width={px * 0.62}>
        <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#0a0f0c" strokeOpacity="0.55" strokeWidth="1.4" transform="rotate(-28 12 12)" />
        <circle cx="12" cy="12" fill="#0a0f0c" r="3.6" />
        <circle cx="20.2" cy="7.4" fill="#0a0f0c" r="1.5" />
      </svg>
    </span>
  );
}
