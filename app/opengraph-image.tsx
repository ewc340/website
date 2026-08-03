import { ImageResponse } from "next/og";

import { siteConfig } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)",
          color: "#fff",
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 28, color: "#c4b5fd", maxWidth: 800 }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
