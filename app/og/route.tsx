import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf8f5",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", marginBottom: 40 }}>
          <span
            style={{ fontSize: 48, fontWeight: 600, color: "#1a1a1a" }}
          >
            Temper
          </span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: "#2d5a3d",
              marginLeft: 12,
            }}
          >
            Labs
          </span>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 400,
            color: "#1a1a1a",
            marginBottom: 16,
          }}
        >
          Red team your AI.
        </div>
        <div style={{ fontSize: 64, fontWeight: 400, color: "#2d5a3d" }}>
          Before attackers do.
        </div>

        <div style={{ fontSize: 24, color: "#9ca3af", marginTop: 60 }}>
          temperlabs.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
