import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f5f8f2_0%,#eef8f8_48%,#fff3ec_100%)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-[#e65f3c] text-white shadow-[0_12px_30px_rgba(230,95,60,0.28)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#66705f]">
              SaaSTom
            </p>
            <p className="text-xl font-semibold text-[#17201b]">BusinessPilot IA</p>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
