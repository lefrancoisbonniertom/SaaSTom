import { AppShell } from "@/components/app-shell";
import { AppStateProvider } from "@/components/app-state-provider";
import type { ReactNode } from "react";

export default function SaaSTomLayout({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  );
}
