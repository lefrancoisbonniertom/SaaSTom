import { ImageResponse } from "next/og";

export const size = { width: 240, height: 240 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #e3c98a, #8a6f3f)",
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 140,
            fontWeight: 700,
            color: "#0e1812",
          }}
        >
          O
        </span>
      </div>
    ),
    { ...size },
  );
}
