import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0c0c0b 0%, #1a1a18 45%, #2a2a28 100%)",
          color: "#f9f7f4",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 12,
            textTransform: "uppercase",
            color: "#c4b9ae",
          }}
        >
          KS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 88, lineHeight: 0.95 }}>
            Kanishk Srivastava
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#d0cbc4",
              maxWidth: 860,
            }}
          >
            Full-Stack Engineer, iOS Developer, and creative technologist.
          </div>
        </div>
      </div>
    ),
    size
  );
}
