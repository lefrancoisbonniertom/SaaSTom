import { ImageResponse } from "next/og";

export const alt = "Orfeo - Copilote IA pour freelances et independants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          backgroundColor: "#0e1812",
          backgroundImage:
            "radial-gradient(circle at 50% -10%, rgba(201,164,94,0.35), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundImage: "linear-gradient(135deg, #e3c98a, #8a6f3f)",
              fontSize: 36,
              fontWeight: 700,
              color: "#0e1812",
            }}
          >
            O
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 8,
                color: "#c9a45e",
                textTransform: "uppercase",
              }}
            >
              Orfeo
            </span>
            <span style={{ fontSize: 30, fontWeight: 600, color: "#f3f1e8" }}>
              BusinessPilot IA
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "#f3f1e8",
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            Pilote ton activite de freelance avec un copilote IA.
          </span>
          <span style={{ fontSize: 28, color: "#c2d0c9", maxWidth: 820 }}>
            Clients, documents et relances generes automatiquement.
          </span>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#a4b3aa" }}>
          orfeo.digitaleweb.fr
        </div>
      </div>
    ),
    { ...size },
  );
}
