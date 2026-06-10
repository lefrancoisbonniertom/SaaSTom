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
    <section className="rounded-lg border border-[#dfe4d8] bg-white p-5 shadow-[0_1px_0_rgba(23,32,27,0.04)]">
      <div className="grid size-10 place-items-center rounded-md bg-[#f3f7ec] text-[#4f6f57]">
        <Plug className="size-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Intégrations</h3>
      <p className="mt-2 text-sm leading-6 text-[#66705f]">
        Reçois un webhook (compatible Zapier, Make, n8n...) à chaque création
        de client ou de document.
      </p>
      <label className="mt-4 block text-sm font-semibold" htmlFor="webhook-url">
        URL du webhook
      </label>
      <input
        className="mt-2 h-10 w-full rounded-md border border-[#dfe4d8] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#4f6f57]"
        id="webhook-url"
        onChange={(event) => setWebhookUrl(event.target.value)}
        placeholder="https://hooks.zapier.com/..."
        type="url"
        value={webhookUrl}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#17201b] px-4 text-sm font-semibold text-white transition hover:bg-[#2a352e] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving || webhookUrl.trim() === savedUrl.trim()}
          onClick={() => void handleSave()}
          type="button"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe4d8] bg-white px-4 text-sm font-semibold text-[#17201b] transition hover:border-[#b9c4ad] disabled:cursor-not-allowed disabled:opacity-50"
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
            feedback.type === "success" ? "text-[#4f6f57]" : "text-[#c0432a]"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-[#90a39a]">
        Événements envoyés : <code>client.created</code>,{" "}
        <code>document.created</code>.
      </p>
    </section>
  );
}
