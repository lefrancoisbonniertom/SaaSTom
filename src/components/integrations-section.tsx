"use client";

import { Plug } from "lucide-react";
import { useState } from "react";

type Feedback = { type: "success" | "error"; text: string };

async function parseMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? "Une erreur est survenue.";
  } catch {
    return "Une erreur est survenue.";
  }
}

export function IntegrationsSection({
  webhookUrl: initialWebhookUrl,
}: {
  webhookUrl: string | null;
}) {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl ?? "");
  const [savedUrl, setSavedUrl] = useState(initialWebhookUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/settings/webhook", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl }),
      });

      if (!response.ok) {
        setFeedback({ type: "error", text: await parseMessage(response) });
        return;
      }

      const payload = (await response.json()) as { webhookUrl: string | null };
      setSavedUrl(payload.webhookUrl ?? "");
      setWebhookUrl(payload.webhookUrl ?? "");
      setFeedback({
        type: "success",
        text: payload.webhookUrl
          ? "Webhook enregistré."
          : "Webhook désactivé.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTest() {
    setIsTesting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/settings/webhook/test", {
        method: "POST",
      });
      const text = await parseMessage(response);
      setFeedback({ type: response.ok ? "success" : "error", text });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-[0_18px_55px_rgba(0,0,0,0.3)]">
      <div className="grid size-10 place-items-center rounded-md bg-gold/10 text-gold">
        <Plug className="size-5" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">Intégrations</h3>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Reçois un webhook (compatible Zapier, Make, n8n...) à chaque création
        de client ou de document.
      </p>
      <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="webhook-url">
        URL du webhook
      </label>
      <input
        className="mt-2 h-10 w-full rounded-md border border-border bg-canvas-soft px-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-gold focus:ring-2 focus:ring-gold/20"
        id="webhook-url"
        onChange={(event) => setWebhookUrl(event.target.value)}
        placeholder="https://hooks.zapier.com/..."
        type="url"
        value={webhookUrl}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-4 text-sm font-semibold text-canvas transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving || webhookUrl.trim() === savedUrl.trim()}
          onClick={() => void handleSave()}
          type="button"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-canvas-soft px-4 text-sm font-semibold text-ink transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isTesting || !savedUrl.trim()}
          onClick={() => void handleTest()}
          type="button"
        >
          {isTesting ? "Envoi..." : "Envoyer un test"}
        </button>
      </div>
      {feedback ? (
        <p
          className={`mt-3 text-sm font-medium ${
            feedback.type === "success" ? "text-sage" : "text-red-400"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-ink-muted">
        Événements envoyés : <code>client.created</code>,{" "}
        <code>document.created</code>.
      </p>
    </section>
  );
}
